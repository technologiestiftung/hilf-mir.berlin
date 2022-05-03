import { FC, useEffect, useState } from "react";
import { TableRowType as FacilityType } from "../common/types/gristData";
const closeIcon = "images/icon_close.svg";

interface FacilityPaginationType {
  facilityIds: number[];
  onChange?: (facilityId: number) => void;
}

export const FacilityPagination: FC<FacilityPaginationType> = ({
  facilityIds,
  onChange = () => undefined,
}) => {
  const [currentFacilityIndex, setCurrentFacilityIndex] = useState(0);

  useEffect(() => {
    onChange(facilityIds[currentFacilityIndex]);
  }, [facilityIds, currentFacilityIndex, onChange]);
  return (
    <div className="flex gap-2 items-center mb-6">
      <p>
        Angebot {currentFacilityIndex + 1} von {facilityIds.length}
      </p>
      <button
        onClick={() => setCurrentFacilityIndex(currentFacilityIndex - 1)}
        disabled={currentFacilityIndex + 1 <= 1}
        className="w-6 h-6 bg-blue-500 text-white rounded-full transition-colors hover:bg-blue-400 disabled:opacity-25"
      >
        ←
      </button>
      <button
        onClick={() => setCurrentFacilityIndex(currentFacilityIndex + 1)}
        disabled={currentFacilityIndex + 1 >= facilityIds.length}
        className="w-6 h-6 bg-blue-500 text-white rounded-full transition-colors hover:bg-blue-400 disabled:opacity-25"
      >
        →
      </button>
    </div>
  );
};
