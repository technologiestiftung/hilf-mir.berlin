import { ChangeEvent, FC, useState } from "react";
import { FeatureType, geocode } from "../lib/requests/geocode";

interface SearchType {
  onSelectResult?: (place: FeatureType) => void;
}
export const Search: FC<SearchType> = ({
  onSelectResult = () => undefined,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<FeatureType[]>([]);
  const onSearchInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);

    if (inputValue.length <= 3) return;
    const results = await geocode(inputValue);
    if (!results) return;
    setSearchResults(results.features);
  };
  return (
    <div className="">
      <div className="grid grid-cols-1">
        <label htmlFor="geocoding-input">Standortsuche</label>
        <input
          type="text"
          name="place"
          id="geocoding-input"
          className="border border-gray-400 px-2 py-1"
          value={searchInput}
          onChange={onSearchInput}
        />
      </div>
      <ul className="mt-3">
        {searchResults.length > 0 &&
          searchResults.map((searchResult) => {
            return (
              <li
                key={`${searchResult.id} ${searchResult.place_name}`}
                className="border-b border-gray-100"
              >
                <button
                  className="text-left w-full py-1 transition-colors hover:bg-gray-50"
                  onClick={() => {
                    setSearchInput("");
                    setSearchResults([]);
                    onSelectResult(searchResult);
                  }}
                >
                  {searchResult.place_name}
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
