import { ApolloConsumer, gql, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import IssueItem from '../IssueItem'
import Loading from '../../Loading'
import ErrorMessage from '../../Error'
import { ButtonUnobtrusive } from '../../Button'

import './style.css'

const GET_ISSUES_OF_REPOSITORY = gql`
  query (
    $repositoryOwner: String!
    $repositoryName: String!
    $issueState: IssueState!
    $cursor: String
  ) {
    repository(name: $repositoryName, owner: $repositoryOwner) {
      issues(first: 5, states: [$issueState]) {
        edges {
          node {
            id
            number
            state
            title
            url
            bodyHTML
            comments(first: 15, after: $cursor) {
              edges {
                node {
                  id
                  author {
                    login
                  }
                  bodyHTML
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      }
    }
  }
`

const ISSUE_STATES = {
  NONE: 'NONE',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
}

const TRANSITION_LABELS = {
  [ISSUE_STATES.NONE]: 'Show Open Issues',
  [ISSUE_STATES.OPEN]: 'Show Closed Issues',
  [ISSUE_STATES.CLOSED]: 'Hide Issues',
}

const TRANSITION_STATE = {
  [ISSUE_STATES.NONE]: ISSUE_STATES.OPEN,
  [ISSUE_STATES.OPEN]: ISSUE_STATES.CLOSED,
  [ISSUE_STATES.CLOSED]: ISSUE_STATES.NONE,
}

const isShow = (issueState) => issueState !== ISSUE_STATES.NONE

const IssuesQ = ({ repositoryOwner, repositoryName, issueState }) => {
  const { data, loading, error, fetchMore } = useQuery(
    GET_ISSUES_OF_REPOSITORY,
    {
      variables: {
        repositoryOwner,
        repositoryName,
        issueState,
      },
    }
  )

  console.log(issueState)

  if (error) {
    return <ErrorMessage error={error} />
  }
  if (loading && !data) {
    return <Loading />
  }

  const { repository } = data

  const filteredRepository = {
    issues: {
      edges: repository.issues.edges.filter(
        (issue) => issue.node.state === issueState
      ),
    },
  }

  if (
    !repository.issues.edges.length ||
    !filteredRepository.issues.edges.length
  ) {
    return <div className="IssueList">No issues ...</div>
  }

  return (
    isShow(issueState) && (
      <IssueList fetchMore={fetchMore} issues={filteredRepository.issues} />
    )
  )
}

const Issues = ({ repositoryOwner, repositoryName }) => {
  const [issueState, setIssueState] = useState(ISSUE_STATES.NONE)
  const onChangeIssueState = (nextIssueState) => {
    setIssueState(nextIssueState)
  }

  return (
    <div className="Issues">
      <IssueFilter
        repositoryOwner={repositoryOwner}
        repositoryName={repositoryName}
        issueState={issueState}
        onChangeIssueState={onChangeIssueState}
      />

      {isShow(issueState) && (
        <IssuesQ
          repositoryName={repositoryName}
          repositoryOwner={repositoryOwner}
          issueState={issueState}
        />
      )}
    </div>
  )
}

const prefetchIssues = (
  client,
  repositoryOwner,
  repositoryName,
  issueState
) => {
  const nextIssueState = TRANSITION_STATE[issueState]

  if (isShow(nextIssueState)) {
    client.query({
      query: GET_ISSUES_OF_REPOSITORY,
      variables: {
        repositoryOwner,
        repositoryName,
        issueState: nextIssueState,
      },
    })
  }
}

const IssueFilter = ({
  issueState,
  onChangeIssueState,
  repositoryOwner,
  repositoryName,
}) => (
  <ApolloConsumer>
    {(client) => (
      <ButtonUnobtrusive
        onClick={() => onChangeIssueState(TRANSITION_STATE[issueState])}
        onMouseOver={() =>
          prefetchIssues(client, repositoryOwner, repositoryName, issueState)
        }
      >
        {TRANSITION_LABELS[issueState]}
      </ButtonUnobtrusive>
    )}
  </ApolloConsumer>
)

const IssueList = ({ issues, fetchMore }) => (
  <div className="IssueList">
    {issues.edges.map(({ node }) => (
      <IssueItem key={node.id} issue={node} fetchMore={fetchMore} />
    ))}
  </div>
)
export default Issues
