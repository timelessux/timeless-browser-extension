import React from 'react'
import { numberFormatter } from '../../../../../../utils/textConvert'
import { HiOutlineChartBar } from 'react-icons/hi'

type Props = {
  viewCount: number
}

const ViewReaction = ({ viewCount }: Props) => {
  return (
    <div className="view-reaction cursor-pointer">
      <span>
        <HiOutlineChartBar size={18} />
      </span>
      <span className="counter align-middle ms-2">
        {/* {numberFormatter(viewCount, 1)} */}
        1,7M
      </span>
    </div>
  )
}

export default ViewReaction
