import React, { memo, useState } from 'react'
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md'
import Slider, { CustomArrowProps, Settings } from 'react-slick'

type ArticleCarouselProps = {
  dataLength: number
  nextArrowClassName?: string
  prevArrowClassName?: string
} & Settings

const CarouselWrapper = memo((props: ArticleCarouselProps) => {
  const { dataLength, prevArrowClassName, nextArrowClassName } = props
  const [isAtStart, setIsAtStart] = useState<boolean>(true)
  const [isAtEnd, setIsAtEnd] = useState<boolean>(false)
  const [isHover, setIsHover] = useState<boolean>(false)

  const getSlidesToShow = () => {
    if (window.innerWidth < 480) return 1
    if (window.innerWidth < 780) return 3
    if (window.innerWidth < 1024) return 4
    return 5
  }

  const checkNotRenderItem = (value: string) => {
    switch (value) {
      case 'start':
        if (isAtStart) return true
        return !isHover

      case 'end':
        if (isAtEnd) return true
        return !isHover
      default:
        return false
    }
  }

  const NextArrow = ({ currentSlide, slideCount, ...props }: CustomArrowProps) => {
    return (
      <MdOutlineArrowForwardIos
        color="white"
        {...props}
        className={`${props.className} ${nextArrowClassName}`}
      />
    )
  }

  const PrevArrow = ({ currentSlide, slideCount, ...props }: CustomArrowProps) => {
    return (
      <MdOutlineArrowBackIos
        color="white"
        {...props}
        className={`${props.className} ${prevArrowClassName}`}
      />
    )
  }

  const settings: Settings = {
    dots: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    className: 'carouselWrapper',
    swipe: false,
    nextArrow: checkNotRenderItem('end') ? <></> : <NextArrow />,
    prevArrow: checkNotRenderItem('start') ? <></> : <PrevArrow />,
    infinite: false,
    beforeChange: (current, next) => {
      const slidesToShow = getSlidesToShow()
      setIsAtStart(next === 0)
      setIsAtEnd(next + slidesToShow >= dataLength)
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 4 }
      },
      {
        breakpoint: 780,
        settings: { slidesToShow: 3, slidesToScroll: 3 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  }

  return (
    <div
      className="slider-container carouselContainer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Slider {...settings} {...props}>
        {props.children}
      </Slider>
    </div>
  )
})

export default CarouselWrapper
