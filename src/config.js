export const config = {
  apiUrl: "https://api.pooya.datisseir.ir/api",
  themeColor: "#4CAF50",
  appName: "Datis2",
  companyName: "شرکت پویا ترابر",
  masterGroups: [
    {
      label: "مقصد",
      value: [
        { label: "مقصد", value: "TargetStationName" },
        { label: "محموله", value: "ContainerStuffName" },
        { label: "جاری", value: "TrackStationName" },
      ],
    },
    {
      label: "مبدأ",
      value: [
        { label: "مبدأ", value: "SourceStationName" },
        { label: "محموله", value: "ContainerStuffName" },
        { label: "جاری", value: "TrackStationName" },
      ],
    },
    {
      label: "وضعیت",
      value: [
        { label: "وضعیت", value: "StateName" },
        { label: "محموله", value: "ContainerStuffName" },
        { label: "جاری", value: "TrackStationName" },
      ],
    },
    {
      label: "جاری",
      value: [
        { label: "جاری", value: "TrackStationName" },
        { label: "محموله", value: "ContainerStuffName" },
        { label: "وضعیت", value: "StateName" },
      ],
    },
    {
      label: "مشتری",
      value: [
        { label: "مشتری", value: "CustomerName" },
        { label: "مقصد", value: "TargetStationName" },
        { label: "جاری", value: "TrackStationName" },
      ],
    },
    {
      label: "محموله",
      value: [
        { label: "محموله", value: "ContainerStuffName" },
        { label: "مقصد", value: "TargetStationName" },
        { label: "جاری", value: "TrackStationName" },
      ],
    },
  ],
  data: [],
};
