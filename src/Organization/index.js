import { gql, useQuery } from '@apollo/client'
import React from 'react'
import ErrorMessage from '../Error'
import Loading from '../Loading'
import RepositoryList, { REPOSITORY_FRAGMENT } from '../Repository'

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query ($organizationName: String!, $cursor: String) {
    organization(login: $organizationName) {
      repositories(first: 5, after: $cursor) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
  ${REPOSITORY_FRAGMENT}
`
const Organization = ({ organizationName }) => {
  const { data, loading, error, fetchMore } = useQuery(
    GET_REPOSITORIES_OF_ORGANIZATION,
    {
      variables: {
        organizationName,
      },
      skip: organizationName === '',
      notifyOnNetworkStatusChange: true,
    }
  )

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (!data || loading) {
    return <Loading />
  }

  return (
    <div>
      <RepositoryList
        loading={loading}
        repositories={data.organization.repositories}
        fetchMore={fetchMore}
        entry={'organization'}
      />
    </div>
  )
}

export default Organization
