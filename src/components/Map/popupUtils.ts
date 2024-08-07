import classNames from '@lib/classNames'
import { FacilityType, getColorByFacilityType } from '@lib/facilityTypeUtil'
import { isFacilityOpened } from '@lib/hooks/useIsFacilityOpened'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { TextsMapType } from '@lib/TextsContext'

export function getPopupHTML(
  facilities: MinimalRecordType[],
  texts: TextsMapType
): string {
  if (facilities.length > 1) return getMultipleFacilitiesHTML(facilities, texts)
  const facility = facilities[0]
  const isOpened = isFacilityOpened(facility)
  return `
    ${getTitleHTML(facility.title, facility.type)}
    ${
      (isOpened &&
        `
        <div class="font-normal text-success text-sm font-sans items-center flex gap-2 px-1 my-1">
          <span class="inline-block w-2 h-2 rounded-full bg-success"></span>
          ${texts.opened}
        </div>
    `) ||
      ''
    }
    ${
      (facility.description?.length > 1 &&
        `
      <p class="p-1 line-clamp-2 font-sans text-sm">
        ${facility.description}
      </p>
    `) ||
      ''
    }
  `
}

function getTitleHTML(title: string, type?: FacilityType): string {
  return `
    <h2 class="font-bold text-lg px-1 leading-tight break-words flex justify-between items-start gap-4">
      <span class="flex justify-between gap-4 items-end line-clamp-3">
      ${title}
      </span>
      ${
        type
          ? `<span
          class="w-4 h-4 rounded-full inline-block shrink-0 grow-0"
          style="background-color: ${getColorByFacilityType(type)};"
        ></span>`
          : ''
      }
    </h2>
  `
}

function getMultipleFacilitiesHTML(
  facilities: MinimalRecordType[],
  texts: TextsMapType
): string {
  const max = 3
  return `
    ${getTitleHTML(`
      ${texts.multipleFacilitiesPopupTitle.replace(
        '#number',
        `${facilities.length}`
      )}
      <span class="font-normal font-sans text-sm text-gray-60">
        ${texts.clickToExpandPopupLabel}
      </span>
    `)}
    ${facilities
      .slice(0, max)
      .map((facility) => getRowHTML(facility.title, facility.type))
      .join('\n')}
    ${
      facilities.length > max
        ? getRowHTML(
            facilities.length > max ? `+${facilities.length - max}` : ''
          )
        : ''
    }
  `
}

function getRowHTML(title: string, type?: FacilityType): string {
  return `
    <div
      class="${classNames(
        `border-t text-sm font-sans border-gray-10 py-1 first-of-type:mt-2`,
        `flex items-center justify-stretch gap-2`
      )}"
      style="border-top-width: 1.5px;"
    >
      ${
        type
          ? `<span
              class="w-3 h-3 rounded-full inline-block shrink-0 grow-0"
              style="background-color: ${getColorByFacilityType(type)};"
            ></span>`
          : ''
      }
      <span class="truncate inline-block">${title}</span>
    </div>
  `
}
