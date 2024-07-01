import { Avatar, Collapse, Divider } from 'antd'
import React, { Fragment, memo, useLayoutEffect } from 'react'
import { FiTrendingUp } from 'react-icons/fi'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import { RiShareBoxLine } from 'react-icons/ri'
import { createPublicClient, createWalletClient, http } from 'viem'
import { useSwitchChain } from 'wagmi'
import { HexString } from '../../../../../ts/types'
import { formatDay } from '../../../../../utils/date'
import { getDomainName } from '../../../../../utils/extractUrl'
import { customChains } from '../../../../../utils/mapChains'
import Contact from '../../../assets/icons/Contact'
import { ARTICLE_DISPLAY_VIEW } from '../../../constants/article'
import { usePageLoading } from '../../../context/LoadingContext'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { articleActions, selectArticleState } from '../../../redux/slices/articles/articleSlice'
import { getArticleByIdThunk } from '../../../redux/slices/articles/articleThunk'
import { setVisibleHeader } from '../../../redux/slices/slide/slide.slice'
import { switchWalletNetwork } from '../../../redux/slices/wallet/wallet.slice'
import { Loader } from '../../component/Loader'
import { useData } from '../../hook/useData'
import ShowMoreText from 'react-show-more-text'
import { BsArrowUpRightCircleFill } from 'react-icons/bs'
import ArticleDetailLeftContentCollapseView from './ArticleDetail/components/ArticleDetailLeftContentCollapse'
import ArticleDetailLeftContentExpandView from './ArticleDetail/components/ArticleDetailLeftContentExpand'

type ArticleDetailViewProps = {
  goBack: () => void
}

const ArticleDetailView = memo((props: ArticleDetailViewProps) => {
  const { goBack } = props
  const dispatch = useAppDispatch()
  const { articleDetail, articleId, fetchingArticleById, isCollapse } =
    useAppSelector(selectArticleState)
  const { wallet } = useAppSelector((state) => state.wallet)
  const { chainFrom } = useData()
  const { openMessage, destroyMessage } = usePageLoading()
  const _signables = articleDetail?.signables?.[0]

  const { chains, reset, switchChain } = useSwitchChain({
    mutation: {
      onSuccess() {
        const _chain = chains.find((e) => e.id === _signables?.chainId)
        _chain && dispatch(switchWalletNetwork(_chain))
        destroyMessage()
      },
      onSettled: () => reset()
    }
  })

  const _onClickMint = async () => {
    if (_signables) {
      openMessage('loading', 'Checking...')
      try {
        if (chainFrom?.id !== _signables?.chainId) {
          switchChain && switchChain({ chainId: _signables.chainId })
          if (!switchChain) {
            //@ts-ignore
            dispatch(switchWalletNetwork(customChains.find((e) => e.id === _signables.chainId)))
            openMessage('success', 'Switched network!')
          }
          return
        }

        const _publicClient = createPublicClient({
          chain: chainFrom,
          transport: http(chainFrom?.rpcUrls?.default?.http?.[0])
        })

        const _walletClient = createWalletClient({
          account: wallet?.account.address as HexString,
          chain: chainFrom,
          transport: http(chainFrom?.rpcUrls?.default?.http?.[0])
        })

        const { request } = await _publicClient.simulateContract({
          account: wallet?.account.address as HexString,
          abi: [_signables.abi],
          address: _signables.contractAddress as HexString,
          functionName: _signables.functionHash,
          args: _signables?.options?.[0].args,
          value: BigInt(_signables?.options?.[0].payableAmountWei)
        })

        await _walletClient.writeContract(request)

        openMessage('success', 'Success!')
      } catch (error) {
        openMessage('error', error?.shortMessage ?? 'Something wrong!')
      }
    }
  }

  useLayoutEffect(() => {
    if (wallet?.account.address && articleId)
      dispatch(getArticleByIdThunk({ address: wallet?.account.address, articleId }))
  }, [articleId])

  useLayoutEffect(() => {
    dispatch(setVisibleHeader({ isVisibleHeader: false }))
    dispatch(articleActions.setCurrentView(ARTICLE_DISPLAY_VIEW.ARTICLE_DETAIL))
    return () => {
      dispatch(setVisibleHeader({ isVisibleHeader: true }))
    }
  }, [])

  return (
    <div className="articleDetailViewContainer">
      {fetchingArticleById && (
        <div className="d-flex w-100 h-100 justify-content-center align-items-center">
          <Loader size="large" />
        </div>
      )}
      {!fetchingArticleById && (
        <div className="contentWrapper fade-in">
          <ArticleDetailLeftContentCollapseView goBack={goBack} />
          <ArticleDetailLeftContentExpandView />
          <div className={`rightContent  ${isCollapse ? 'd-none' : ''}`}>
            <div className="d-flex align-items-center justify-content-between w-100 pb-2">
              <button
                className="hover goBackButton"
                style={{ border: 'none' }}
                onClick={() => {
                  goBack()
                  dispatch(articleActions.setIsCollapse(false))
                }}
              >
                <MdKeyboardArrowLeft color="#fff" size={24} />
              </button>
              <div className="tag">{articleDetail?.ability.type}</div>
            </div>
            <div
              className="hidden-scroll-bar w-100"
              style={{ overflow: 'auto', paddingBottom: 30 }}
            >
              <div className="title mb-3">{articleDetail?.ability.title}</div>

              {articleDetail?.ability.description && (
                <div className="info-item d-flex flex-column justify-content-between  mb-4">
                  <div className="opacity-50">
                    <ShowMoreText
                      lines={2}
                      more="See more"
                      less="See less"
                      className="content-description "
                      expanded={false}
                      truncatedEndingComponent={'... '}
                    >
                      <div>{articleDetail?.ability.description}</div>
                    </ShowMoreText>
                  </div>
                </div>
              )}

              {/* {articleDetail?.details?.rewards && (
                <div className="box-grey mb-3">
                  <div className="info-item px-4 py-3 d-flex flex-column justify-content-between">
                    <div className="flex-fill">Rewards</div>
                    <div className="opacity-50">{`Earn ${articleDetail?.details?.rewards?.[0]?.amount} ${articleDetail?.details?.rewards?.[0]?.name}`}</div>
                  </div>
                </div>
              )} */}

              <div className="reasonWrapper mb-3">
                <span className="title">Why am I seeing this?</span>
                {articleDetail?.allReasons.map((e, i) => {
                  const _title = e.identities?.[0].name
                  const _community = e.community?.title
                  return (
                    <Collapse
                      key={i}
                      ghost
                      accordion
                      collapsible={e.type === 'open' ? 'disabled' : 'header'}
                      size="small"
                      destroyInactivePanel
                      expandIconPosition="end"
                      className="reasonCollapse mt-1 mb-1"
                      expandIcon={({ isActive }) => {
                        if (e.type === 'open') return undefined

                        if (isActive) {
                          return (
                            <button className="hover collapse-button" style={{ border: 'none' }}>
                              <MdKeyboardArrowDown color="#fff" />
                            </button>
                          )
                        }

                        return (
                          <button className="hover collapse-button" style={{ border: 'none' }}>
                            <MdKeyboardArrowRight color="#fff" />
                          </button>
                        )
                      }}
                      items={[
                        {
                          key: e.type,
                          label: (
                            <div className="d-flex align-items-center">
                              {(e.type === 'minted-from-creator-before' ||
                                e.type === 'tokengate') && (
                                <Fragment>
                                  {e.imageUrl && <img className="circleIcon" src={e.imageUrl} />}
                                </Fragment>
                              )}
                              {(e.type === 'creator' || e.type === 'influencer') && (
                                <Fragment>
                                  {e.imageUrl && <img className="circleIcon" src={e.imageUrl} />}
                                  {!e.imageUrl && <Contact className="me-1" />}
                                </Fragment>
                              )}
                              {e.type === 'trending-in-community' && (
                                <img src={e.imageUrl ?? ''} className="circleIcon" />
                              )}
                              {e.type === 'trending' && (
                                <Fragment>
                                  {!e.imageUrl && <FiTrendingUp className="me-2" size={20} />}
                                  {e.imageUrl && <img className="circleIcon" src={e.imageUrl} />}
                                </Fragment>
                              )}
                              {e.text}
                            </div>
                          ),
                          className: 'reasonItem',
                          children: (
                            <div className="reasonContent">
                              {_title && (e.type === 'creator' || e.type === 'influencer') && (
                                <span>{`${_title} is a popular person onchain.`}</span>
                              )}
                              {!_title && e.type === 'trending' && (
                                <span>{`This transaction is popular onchain.`}</span>
                              )}
                              {_community && e.type === 'trending-in-community' && (
                                <span>{`${_community} is a popular NFT community.`}</span>
                              )}
                            </div>
                          )
                        }
                      ]}
                    />
                  )
                })}
              </div>

              <div className="box-grey">
                <div className="info-item px-4 py-3 d-flex justify-content-between">
                  <div className="flex-fill">Blockchain</div>
                  <div className="d-flex align-items-center gap-1">
                    <Avatar src={articleDetail?.ability.thumbnailUrls.sm} size={24} />
                    <div className="opacity-50 text-capitalize">
                      {articleDetail?.ability?.chain}
                    </div>
                  </div>
                </div>
                {articleDetail?.ability.supplier && (
                  <div className="info-item px-4 py-3 d-flex justify-content-between">
                    <div className="flex-fill">Creation tool</div>
                    <div className="opacity-50">{articleDetail?.ability?.supplier?.name}</div>
                  </div>
                )}
                <div className="info-item px-4 py-3 d-flex justify-content-between">
                  <div className="flex-fill">Open at</div>
                  <div className="opacity-50">
                    {formatDay(new Date(articleDetail?.ability?.openAt ?? ''))}
                  </div>
                </div>
                {articleDetail?.ability.closeAt && (
                  <div className="info-item px-4 py-3 d-flex justify-content-between">
                    <div className="flex-fill">Close at</div>
                    <div className="opacity-50">
                      {formatDay(new Date(articleDetail?.ability?.closeAt ?? ''))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Divider />
            {_signables && (
              <div className="d-flex align-self-center mb-3 cursor-pointer">
                <button
                  onClick={_onClickMint}
                  className="open-sea-button box-grey text-center gap-2 px-5 py-2"
                  style={{ borderRadius: 50 }}
                >
                  <BsArrowUpRightCircleFill className="me-1 opacity-60 --hover" />
                  <span className="align-middle opacity-60 --hover">
                    {_signables.options?.[0].label}
                  </span>
                </button>
              </div>
            )}
            <div className="d-flex align-self-center mb-3 cursor-pointer">
              <a
                target="_blank"
                rel="noreferrer"
                href={articleDetail?.ability.action.linkUrl}
                className="open-sea-button box-grey text-center gap-2 px-5 py-2"
                style={{ borderRadius: 50 }}
              >
                <RiShareBoxLine size={20} className="me-2 opacity-60 --hover" />
                <span className="opacity-60 --hover">
                  {getDomainName(articleDetail?.ability?.action?.linkUrl)}
                </span>
              </a>
            </div>

            <div className="linkContainer">
              <span>{'Website'}</span>
              {' | '}
              <span>{'Discord'}</span>
              {' | '}
              <span>{'Twitter'}</span>
              {' | '}
              <span>{'Medium'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default ArticleDetailView
