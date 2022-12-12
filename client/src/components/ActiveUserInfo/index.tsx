import Modal from '@components/Modal';
import React, { MutableRefObject, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ReactComponent as User } from '@assets/images/user.svg';
import stc from 'string-to-color';
import {
  ListToggleButton,
  ActiveUserInfoList,
  ActiveUserInfoItem,
  ActiveUserInfoBox,
  ActiveUserIconBox,
  ActiveUserInfoLayout,
} from './styles';

interface PropsType {
  myId: string;
  myName: string;
  socketRef: MutableRefObject<Socket | null>;
  joinList: Map<string, UserType>;
  setJoinList: React.Dispatch<React.SetStateAction<Map<string, UserType>>>;
}

function ActiveUserInfo({ myId, myName, socketRef, joinList, setJoinList }: PropsType) {
  const [isListOpen, setListOpen] = useState<boolean>(false);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) {
      return;
    }

    socket.on('join', (response: ResTemplateType<UserType>) => {
      if (!response.data) {
        return;
      }

      /**
       * 멘토님이 조언해주신 부분
       * 내 정보(myId)가 초기화되지 않았을 때 요청 튕기기
       */
      if (!myId) {
        return;
      }

      const userInfo = response.data;

      const { userId } = userInfo;

      setJoinList((prev) => {
        const newMap = new Map(prev);
        newMap.set(userId, userInfo);
        return newMap;
      });
    });

    socket.on('leave', (response: ResTemplateType<string>) => {
      if (!response.data) {
        return;
      }

      if (!myId) {
        return;
      }

      const userId = response.data;

      setJoinList((prev) => {
        const newMap = new Map(prev);
        const userInfo = newMap.get(userId);

        if (!userInfo) {
          return newMap;
        }

        userInfo.isOnline = false;
        newMap.set(userId, userInfo);

        return newMap;
      });
    });
  }, []);

  const onlineUserList = [...joinList].filter(([userId, userInfo]) => userInfo.isOnline);
  const offlineUserList = [...joinList].filter(([userId, userInfo]) => !userInfo.isOnline);

  return (
    <ActiveUserInfoLayout>
      <ListToggleButton
        type="button"
        onClick={(event) => {
          setListOpen(!isListOpen);

          event.stopPropagation();
        }}
      >
        <User />
      </ListToggleButton>
      <Modal isOpen={isListOpen} setIsOpen={setListOpen}>
        <ActiveUserInfoBox>
          <ActiveUserInfoList>
            <li>
              <p>접속자 총 {onlineUserList.length}명</p>
            </li>
            {onlineUserList.map(([userId, userInfo]) => {
              return (
                <ActiveUserInfoItem key={userId}>
                  <ActiveUserIconBox style={{ backgroundColor: `${stc(userInfo.userId)}` }} />
                  <p>
                    {userInfo.userName}
                    {myId === userId && ' (나)'}
                  </p>
                </ActiveUserInfoItem>
              );
            })}
            <li>
              <p>오프라인 {offlineUserList.length}명</p>
            </li>
            {offlineUserList.map(([userId, userInfo]) => {
              return (
                <ActiveUserInfoItem key={userId}>
                  <ActiveUserIconBox style={{ backgroundColor: `${stc(userInfo.userId)}` }} />
                  <p>
                    {userInfo.userName}
                    {myId === userId && ' (나)'}
                  </p>
                </ActiveUserInfoItem>
              );
            })}
          </ActiveUserInfoList>
        </ActiveUserInfoBox>
      </Modal>
    </ActiveUserInfoLayout>
  );
}

export default ActiveUserInfo;
