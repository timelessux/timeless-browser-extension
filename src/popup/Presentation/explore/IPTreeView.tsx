import React, { useEffect, useState } from 'react'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { getItemTree } from '../../../../services/explore'
import { useAppSelector } from '../../redux/hook'
import { TExploreItem } from '../../redux/slices/explore/exploreSlice'
import LineNode from '../component/LineNode'

type IPTreeViewProps = {
  goBack: () => void
}

const IPTreeView = (props: IPTreeViewProps) => {
  const { goBack } = props
  const { exploreItem } = useAppSelector((state) => state.exploreState)
  const [parents, setParents] = useState<TExploreItem[]>([])

  useEffect(() => {
    if (exploreItem?.id) getItemTree(exploreItem?.id).then(setParents)
  }, [exploreItem])

  return (
    <div className="ipTreeViewContainer">
      <div className="thumbnailContainer">
        <img
          src={exploreItem?.thumbnail}
          alt="thumbnail"
          className="thumbnail"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="rightContainer">
        <div className="headerContainer">
          <button onClick={goBack} className="goBackButton hover">
            <MdKeyboardArrowLeft color="#fff" size={24} />
          </button>
          {/* <button>{'Subscribe?'}</button> */}
        </div>
        <div
          className="hidden-scroll-bar"
          style={{ maxHeight: 'calc(100% - 44px)', overflowY: 'auto' }}
        >
          <div className="treeContainer">
            {parents.map((e, index) => {
              const totalItem = parents?.length ?? 0
              return (
                <div className="d-flex flex-column align-items-center" key={index}>
                  <span className="title">{e.name}</span>
                  <img
                    src={e.thumbnail}
                    width={120}
                    height={120}
                    alt="thumbnail"
                    style={{ borderRadius: 8 }}
                  />
                  {/* <ImageMeta url={e.thumbnail} name="thumbnail" /> */}
                  <div className="d-flex w-100 align-items-center gap-4">
                    <div style={{ flex: 1 }} />
                    <div className="d-flex justify-content-center">
                      <LineNode height={60} />
                    </div>
                    <span className="textDate">{e.createdAt}</span>
                  </div>
                  {index === totalItem - 1 && <p>{'Remix from'}</p>}
                </div>
              )
            })}
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <a
            className="open-sea-button box-grey hover d-flex gap-2 align-items-center px-5 py-2"
            target="_blank"
            rel="noreferrer"
            href={exploreItem?.socialLinks?.explorerLink}
          >
            <span className="d-flex align-items-center" style={{ height: 16 }}>
              <BsFillArrowUpRightCircleFill />
            </span>
            <span className="ms-2 textDate">{'Explorer'}</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default IPTreeView
