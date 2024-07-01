import { useEffect, useState } from 'react'
import { Publication } from '../../../../Domain/Model/Publication'
import { Profile } from '../../../../Domain/Model/Profile'
import { getData } from '../../../../../../utils/chromeStorage'
import { ETypePost } from '../../../../../../ts'
import { PostRepository } from '../../../../Domain/Repository'
import BaseService from '../../../../../../services/axios'
import { removeDuplicateObjects } from '../../../../../../utils/function'

const axiosClient = new BaseService()

export const PopularTabViewController = () => {
  const [lensProfile, setLensProfile] = useState<Profile>()

  const [popularPosts, setPopularPosts] = useState<{
    data: Publication[]
    cursor: string | null
  }>({
    data: [],
    cursor: null
  })

  const [errorGetPopularPosts, setErrorGetPopularPosts] = useState('')

  const handleGetListPopularPost = async () => {
    try {
      const query = `
      query MyQuery {
        getNewsFeed(request: {feedAlgorithm: TIMELESS, address: "${lensProfile?.ownerAddress}", cursor: ${
          popularPosts.cursor ? `"${popularPosts.cursor}"` : null
        }, feedType: ${ETypePost.POPULAR}, publicationTypes: [POST, MIRROR], limit: 10}) {
          pageMeta { nextCursor }
          items {
            ... on Post {
              __typename
              id
              collectCount
              dislikeCount
              likeCount
              commentCount
              mirrorCount
              title
              content
              metadata_
              media {
                altTag
                cover
                item
                type
              }
              profile {
                avatar
                id
                name
                handle
                isFollowedByMe
              }
              createdAt
              isCollectedByMe
              isMirroredByMe
              isReactedByMe
              authorHandle
            }

            ... on Mirror {
              __typename
              id
              collectCount
              dislikeCount
              likeCount
              commentCount
              mirrorCount
              title
              content
              metadata_
              media {
                altTag
                cover
                item
                type
              }
              profile {
                avatar
                id
                name
                handle
                isFollowedByMe
              }
              createdAt
              isCollectedByMe
              isMirroredByMe
              isReactedByMe
              authorHandle
              parentPost {
                id
                collectCount
                dislikeCount
                likeCount
                commentCount
                mirrorCount
                title
                content
                metadata_
                media {
                  altTag
                  cover
                  item
                  type
                }
                profile {
                  avatar
                  id
                  name
                  handle
                  isFollowedByMe
                }
                createdAt
                isCollectedByMe
                isMirroredByMe
                isReactedByMe
                authorHandle
              }
            }
          }
        }
      }
    `

      const { data } = await PostRepository(axiosClient).getPosts(query)

      setPopularPosts(
        (prev) =>
          ({
            data: removeDuplicateObjects([...prev.data, ...(data?.getNewsFeed.items ?? [])], 'id'),
            cursor: data?.getNewsFeed.pageMeta.nextCursor
          }) as { data: Publication[]; cursor: string | null }
      )
    } catch (error) {
      setErrorGetPopularPosts(error)
    }
  }

  useEffect(() => {
    getData('lensProfile').then((value) => {
      if (value) setLensProfile(value)
    })
  }, [])

  return {
    lensProfile,
    popularPosts,
    errorGetPopularPosts,
    onGetListPopularPost: handleGetListPopularPost
  }
}
