import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import * as routes from '../../constants/routes'
import Button from '../../Button'
import Input from '../../Input'
import './style.css'

const Navigation = ({
  location: { pathname },
  organizationName,
  onOrganizationSearch,
}) => {
  return (
    <header className="Navigation">
      <div className="Navigation-link">
        <Link to={routes.PROFILE}>Profile</Link>
      </div>
      <div className="Navigation-link">
        <Link to={routes.ORGANIZATION}>Organization</Link>
      </div>
      {pathname === routes.ORGANIZATION && (
        <OrganizationSearch
          organizationName={organizationName}
          onOrganizationSearch={onOrganizationSearch}
        />
      )}
    </header>
  )
}

const OrganizationSearch = (props) => {
  const [value, setValue] = useState(props.organizationName)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const onSubmit = (e) => {
    props.onOrganizationSearch(value)
    console.log(props.onOrganizationSearch(value))
    e.preventDefault()
  }
  return (
    <div className="Navigation-search">
      <form onSubmit={onSubmit}>
        <Input color={'white'} type="text" value={value} onChange={onChange} />{' '}
        <Button color={'white'} type="submit">
          Search
        </Button>
      </form>
    </div>
  )
}

export default withRouter(Navigation)
