import { FC, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperClass } from 'swiper/types'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css'
import classNames from '@lib/classNames'
import { FacilityCarouselItem } from './FacilityCarouselItem'
import { IconButton } from './IconButton'
import { Arrow } from './icons/Arrow'

interface FacilityCarouselPropsType {
  facilities: MinimalRecordType[]
}

export const FacilityCarousel: FC<FacilityCarouselPropsType> = ({
  facilities,
}) => {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  if (facilities.length === 0) return null
  return (
    <div
      className={classNames(
        `fixed bottom-0 left-0 lg:left-sidebarW `,
        `w-full lg:w-mapW z-20 pb-8`
      )}
    >
      <div className="relative w-full h-[232px]">
        <div
          className={classNames(
            `absolute left-1/2 w-[calc(300%-200px)] xl:w-[calc(100%+200px)]`,
            `-translate-x-1/2 bottom-0 xl:translate-x-0 xl:left-[-100px]`
          )}
        >
          <div className="relative">
            <Swiper
              className="w-full flex justify-center items-center"
              spaceBetween={20}
              slidesPerView={3}
              breakpoints={{
                1280: {
                  slidesPerView: 2,
                },
              }}
              centeredSlides
              onInit={setSwiper}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex)
              }}
            >
              {facilities.map((facility) => (
                <SwiperSlide key={facility.id} className="!h-auto">
                  <FacilityCarouselItem facility={facility} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <IconButton
          aria-label="Previous slide"
          onClick={() => {
            swiper?.slidePrev()
          }}
          className={classNames(
            `absolute left-0 top-1/2 transform -translate-y-1/2`,
            `z-10 flex items-center justify-center rounded-l-none`,
            `border-l-0 transition-opacity`,
            activeIndex === 0 && `opacity-0 pointer-events-none`
          )}
        >
          <Arrow orientation="left" />
        </IconButton>
        <IconButton
          aria-label="Next slide"
          onClick={() => {
            swiper?.slideNext()
          }}
          className={classNames(
            `absolute right-0 top-1/2 transform -translate-y-1/2`,
            `z-10 flex items-center justify-center rounded-r-none`,
            `border-r-0 transition-opacity`,
            activeIndex === facilities.length - 1 &&
              `opacity-0 pointer-events-none`
          )}
        >
          <Arrow orientation="right" />
        </IconButton>
      </div>
    </div>
  )
}
