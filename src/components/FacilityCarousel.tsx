import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { FacilityCarouselSlide } from './FacilityCarouselSlide'

// eslint-disable-next-line import/no-unresolved
import 'swiper/css'
import classNames from '@lib/classNames'

interface FacilityCarouselPropsType {
  facilities: MinimalRecordType[]
}

export const FacilityCarousel: FC<FacilityCarouselPropsType> = ({
  facilities,
}) => {
  if (facilities.length === 0) return null
  return (
    <div
      className={classNames(
        `fixed bottom-0 left-0 lg:left-sidebarW `,
        `w-full lg:w-mapW z-20 pb-8`
      )}
    >
      <div className="relative w-full">
        <div
          className={classNames(
            `absolute left-1/2 w-[calc(300%-200px)] xl:w-[calc(100%+200px)]`,
            `-translate-x-1/2 bottom-0 xl:translate-x-0 xl:left-[-100px]`
          )}
        >
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
          >
            {facilities.map((facility) => (
              <SwiperSlide key={facility.id} className="!h-auto">
                <FacilityCarouselSlide {...facility} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}
