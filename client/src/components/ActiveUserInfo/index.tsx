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
    const clientSocket = socketRef.current;

    if (!clientSocket) {
      return;
    }

    clientSocket.on('join', (data: UserType) => {
      /**
       * 멘토님이 조언해주신 부분
       * 내 정보(myId)가 초기화되지 않았을 때 요청 튕기기
       */
      if (!myId) {
        return;
      }

      const { userId } = data;

      setJoinList((prev) => {
        const newMap = new Map(prev);

        if (!newMap.has(userId) && myId !== userId) {
          newMap.set(userId, data);
        }

        return newMap;
      });
    });

    clientSocket.on('leave', (data: string) => {
      const userId = data;

      if (!myId) {
        return;
      }

      setJoinList((prev) => {
        const newMap = new Map(prev);

        if (newMap.has(userId)) {
          newMap.delete(userId);
        }

        return newMap;
      });
    });
  }, []);

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
          <p>접속자 총 {joinList.size}명</p>
          <ActiveUserInfoList>
            {[...joinList].map(([userId, userInfo]) => {
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
