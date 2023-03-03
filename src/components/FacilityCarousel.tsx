import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
// eslint-disable-next-line import/no-unresolved
import 'swiper/css'
import classNames from '@lib/classNames'
import { Card } from './Card'
import { Button } from './Button'
import { Arrow } from './icons/Arrow'
import { useUrlState } from '@lib/UrlStateContext'
import { useTexts } from '@lib/TextsContext'

interface FacilityCarouselPropsType {
  facilities: MinimalRecordType[]
}

export const FacilityCarousel: FC<FacilityCarouselPropsType> = ({
  facilities,
}) => {
  const [urlState] = useUrlState()
  const texts = useTexts()

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
                <Card
                  title={facility.title}
                  footer={
                    <div className="flex justify-end">
                      <Button
                        tag="a"
                        href={`/${facility.id}`}
                        query={{
                          ...urlState,
                          latitude: facility.latitude,
                          longitude: facility.longitude,
                        }}
                        size="small"
                        scheme="primary"
                        className="w-1/2 flex flex-nowrap gap-x-2 items-center"
                      >
                        {texts.moreInfos}
                        <Arrow orientation="right" className="w-4 h-4" />
                      </Button>
                    </div>
                  }
                >
                  <p className="line-clamp-4">{facility.description}</p>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}
