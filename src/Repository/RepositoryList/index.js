import React from 'react'
import FetchMore from '../../FetchMore'
import Loading from '../../Loading'
import RepositoryItem from '../RepositoryItem'
import Issues from '../../Issue'
import '../style.css'

const getUpdateQuery =
  (entry) =>
  (previousResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) {
      return previousResult
    }

    return {
      ...previousResult,
      [entry]: {
        ...previousResult[entry],
        repositories: {
          ...previousResult[entry].repositories,
          ...fetchMoreResult[entry].repositories,
          edges: [
            ...previousResult[entry].repositories.edges,
            ...fetchMoreResult[entry].repositories.edges,
          ],
        },
      },
    }
  }

const RepositoryList = ({ repositories, fetchMore, loading, entry }) => {
  return (
    <>
      {repositories.edges.map(({ node }) => {
        return (
          <div key={node.id} className="RepositoryItem">
            <RepositoryItem {...node} />

            <Issues
              repositoryName={node.name}
              repositoryOwner={node.owner.login}
            />
          </div>
        )
      })}
      <FetchMore
        loading={loading}
        hasNextPage={repositories.pageInfo.hasNextPage}
        variables={{
          cursor: repositories.pageInfo.endCursor,
        }}
        updateQuery={getUpdateQuery(entry)}
        fetchMore={fetchMore}
      >
        Repositories
      </FetchMore>
    </>
  )
}

export default RepositoryList
