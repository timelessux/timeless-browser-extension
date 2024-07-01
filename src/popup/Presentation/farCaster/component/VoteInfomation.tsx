import { Progress } from 'antd'
import { BsDot, BsFillCheckCircleFill } from 'react-icons/bs'
import React from 'react'
import { numberFormatter } from '../../../../../utils/textConvert'
import { Proposal } from '../../../Domain/Model/Publication'

type Props = {
  voteData: Proposal
}

function VoteInformation({ voteData }: Props) {
  const isVote = false
  return (
    <div className="vote-box p-2">
      <div className="title">{voteData.body}</div>
      {voteData.choices?.map((choice, index) => {
        return (
          <div
            className="choice d-flex align-items-center p-2 cursor-pointer"
            key={`${choice}-${index}`}
          >
            <div className="flex-fill">
              <div className="d-flex justify-content-between">
                <div
                  className="d-flex align-items-center"
                  style={{ flex: 1, wordBreak: 'break-word' }}
                >
                  <div className="me-2">
                    {isVote ? (
                      <BsFillCheckCircleFill
                        size={18}
                        style={{
                          borderRadius: '50%',
                          background: '#fff',
                          color: 'green'
                        }}
                      />
                    ) : (
                      <BsFillCheckCircleFill
                        size={18}
                        style={{
                          borderRadius: '50%',
                          background: '#000',
                          color: 'grey'
                        }}
                      />
                    )}
                  </div>
                  <div className="title">{choice}</div>
                </div>
                <div className="d-flex align-items-end justify-content-end group-score">
                  <div className="score">{numberFormatter(voteData.scores[index], 1)}</div>
                  <BsDot size={14} />
                  <div className="percent">
                    {((voteData.scores[index] / voteData.scores_total) * 100).toFixed(2) || 0.0} %
                  </div>
                </div>
              </div>
              <Progress
                percent={(voteData.scores[index] / voteData.scores_total) * 100}
                showInfo={false}
                trailColor="gray"
                strokeColor="green"
                className="mb-0"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default VoteInformation
