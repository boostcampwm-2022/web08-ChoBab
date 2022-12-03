/**
 * Marker Clustering 기능은 Naver Maps JavaScript API v3 에서 따로 제공해주지 않는다고 합니다.
 * https://developers.naver.com/forum/posts/14968
 *
 * 대신 navermaps/marker-tools.js github repository 에 예제 코드로 구현되어 있어 이를 가져다 사용하면 됩니다.
 * 단, 타입 파일은 별도로 제공해주지 않아서 아래 파일을 보고 따로 타입을 선언해 주었습니다.
 * https://github.com/navermaps/marker-tools.js/blob/master/marker-clustering/src/MarkerClustering.js
 */

type HTMLString = string;

interface MarkerIcon {
  content: HTMLString;
  size?: N.Size;
  anchor?: N.Point;
}

interface MarkerClusteringOptionsTypes {
  // 클러스터 마커를 올릴 지도입니다.
  map?: naver.maps.Map | null;

  // 클러스터 마커를 구성할 마커입니다.
  markers?: naver.maps.Marker[];

  // 클러스터 마커 클릭 시 줌 동작 여부입니다.
  disableClickZoom?: boolean;

  // 클러스터를 구성할 최소 마커 수입니다.
  minClusterSize?: number;

  // 클러스터 마커로 표현할 최대 줌 레벨입니다. 해당 줌 레벨보다 높으면, 클러스터를 구성하고 있는 마커를 노출합니다.
  maxZoom?: number;

  // 클러스터를 구성할 그리드 크기입니다. 단위는 픽셀입니다.
  gridSize?: number;

  // 클러스터 마커의 아이콘입니다. NAVER Maps JavaScript API v3에서 제공하는 아이콘, 심볼, HTML 마커 유형을 모두 사용할 수 있습니다.
  icons?: MarkerIcon[];

  // 클러스터 마커의 아이콘 배열에서 어떤 아이콘을 선택할 것인지 인덱스를 결정합니다.
  indexGenerator?: number[];

  // 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부입니다.
  averageCenter?: boolean;

  // 클러스터 마커를 갱신할 때 호출하는 콜백함수입니다. 이 함수를 통해 클러스터 마커에 개수를 표현하는 등의 엘리먼트를 조작할 수 있습니다.
  stylingFunction?: (clusterMarker: naver.maps.Marker, count: number) => void;
}

declare class MarkerClustering {
  constructor(options: MarkerClusteringOptionsTypes);

  // 많은 메서드가 있지만 당장 사용되지 않아 선언하지 않았습니다.
}
