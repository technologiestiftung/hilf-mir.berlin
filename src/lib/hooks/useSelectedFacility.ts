import { Dispatch, SetStateAction, useState } from "react";
import { TableRowType } from "../../common/types/gristData";

interface useSelectedFacilityReturnType {
  selectedFacility: TableRowType | undefined;
  setSelectedFacility: Dispatch<SetStateAction<TableRowType | undefined>>;
}

export const useSelectedFacility = (): useSelectedFacilityReturnType => {
  const [selectedFacility, setSelectedFacility] = useState<
    TableRowType | undefined
  >();

  return {
    selectedFacility,
    setSelectedFacility,
  };
};
