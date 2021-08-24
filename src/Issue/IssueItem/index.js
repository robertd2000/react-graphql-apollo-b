import React, { useState } from 'react'
import { ButtonUnobtrusive } from '../../Button'
import FetchMore from '../../FetchMore'
import Link from '../../Link'
import './style.css'
const IssueItem = ({ issue, fetchMore }) => {
  return (
    <div className="IssueItem">
      <div className="IssueItem-content">
        <h3>
          <Link href={issue.url}>{issue.title}</Link>
        </h3>
        <div dangerouslySetInnerHTML={{ __html: issue.bodyHTML }} />
        <Comments comments={issue.comments} fetchMore={fetchMore} />
      </div>
    </div>
  )
}

const getUpdateQuery =
  (entry) =>
  (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult
    }

    const result = {
      ...previousResult,
      ...fetchMoreResult,
    }
    console.log(result)
    return result
  }

const Comments = ({ comments, fetchMore }) => {
  const [showComments, setShowComments] = useState(false)

  const onShow = () => {
    setShowComments(!showComments)
  }

  if (comments.edges.length < 1) {
    return <h4>No comments</h4>
  }
  return (
    <div className="comments">
      <ButtonUnobtrusive onClick={onShow}>
        {showComments ? 'Hide' : 'Show'} comments
      </ButtonUnobtrusive>
      {showComments && (
        <>
          {comments.edges.map((comment) => {
            const { author, bodyHTML, id } = comment?.node

            return (
              <div key={id}>
                <h3>{author?.login}</h3>
                <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
              </div>
            )
          })}
          <FetchMore
            hasNextPage={comments.pageInfo.hasNextPage}
            variables={{
              cursor: comments.pageInfo.endCursor,
            }}
            updateQuery={getUpdateQuery('repository')}
            fetchMore={fetchMore}
          >
            15 comments
          </FetchMore>{' '}
        </>
      )}
    </div>
  )
}

export default IssueItem
