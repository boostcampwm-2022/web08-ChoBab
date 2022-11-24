import axios from 'axios';

/**
 * 좌표를 통해 주소 정보(법정동, 행정동, 지번주소, 도로명주소 등)를 반환
 */
const requestReverseGeocoding = async (lat: number, lng: number): Promise<any> => {
  const position = `${lng},${lat}`;
  try {
    const { data } = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': import.meta.env.VITE_APP_NAVER_MAP_CLIENTID,
          'X-NCP-APIGW-API-KEY': import.meta.env.VITE_APP_NAVER_MAP_CLIENT_SECRET,
        },
        params: {
          coords: position,
          output: 'json',
          orders: 'roadaddr',
        },
      }
    );

    // 성공적인 응답인가?
    if (data?.status?.code === 0) {
      return data.results[0];
    }
    throw new Error();
  } catch (e) {
    throw new Error('위치 좌표의 주소 변환 요청이 실패했습니다.');
  }
};

const combineRegionAndLandData = (regionData: any, landData: any) => {
  const { area1, area2 } = regionData;
  const { name, number1 } = landData;

  return [area1?.name, area2?.name, name, number1].filter((v) => v).join(' ');
};

export const reverseGeocoding = async (lat: number, lng: number): Promise<string> => {
  const data = await requestReverseGeocoding(lat, lng);
  const { region, land } = data;
  return combineRegionAndLandData(region, land);
};
