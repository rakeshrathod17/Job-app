import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { BsSearch } from 'react-icons/bs'
import Header from '../Header/Header'
import FiltersGroup from '../FiltersGroup/FiltersGroup'
import JobCard from '../JobCard/JobCard'
import './Jobs.css'

const employmentTypesList = [
  { label: 'Full Time', employmentTypeId: 'FULLTIME' },
  { label: 'Part Time', employmentTypeId: 'PARTTIME' },
  { label: 'Freelance', employmentTypeId: 'FREELANCE' },
  { label: 'Internship', employmentTypeId: 'INTERNSHIP' },
]

const salaryRangesList = [
  { salaryRangeId: '1000000', label: '10 LPA and above' },
  { salaryRangeId: '2000000', label: '20 LPA and above' },
  { salaryRangeId: '3000000', label: '30 LPA and above' },
  { salaryRangeId: '4000000', label: '40 LPA and above' },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const Jobs = () => {
  const [jobsList, setJobsList] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [employeeType, setEmployeeType] = useState([])
  const [minimumSalary, setMinimumSalary] = useState(0)
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    getJobs()
  }, [employeeType, minimumSalary, searchInput])

  const getJobs = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeType.join()}&minimum_package=${minimumSalary}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      console.log("data",data);
      
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      setJobsList(updatedJobsData)
      setApiStatus(apiStatusConstants.success)
    } else {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  const renderJobsList = () => {
    const renderJobsList = jobsList.length > 0
    return renderJobsList ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsList.map((job,index) => (
            <JobCard jobData={job} key={index} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  const renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="jobs-failure-button" onClick={getJobs}>
        Retry
      </button>
    </div>
  )

  const renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <h2>Loading</h2>
    </div>
  )

  const renderAllJobs = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderJobsList()
      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.inProgress:
        return renderLoadingView()
      default:
        return null
    }
  }

  const changeSearchInput = event => {
    setSearchInput(event.target.value)
  }

  const onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      getJobs()
    }
  }

  const changeSalary = salary => {
    setMinimumSalary(salary)
  }

  const changeEmployeeList = (type, isChecked) => {
  setEmployeeType((prev) => {
    const updatedEmployeeTypes = new Set(prev);
    if (isChecked) {
      updatedEmployeeTypes.add(type);
    } else {
      updatedEmployeeTypes.delete(type); 
    }
    return [...updatedEmployeeTypes];
  });
};


  return (
    <>
      <Header />
      <div className="jobs-container">
        <div className="jobs-content">
          <FiltersGroup
            employmentTypesList={employmentTypesList}
            salaryRangesList={salaryRangesList}
            changeSearchInput={changeSearchInput}
            searchInput={searchInput}
            getJobs={getJobs}
            changeSalary={changeSalary}
            changeEmployeeList={changeEmployeeList}
          />
          <div className="search-input-jobs-list-container">
            <div className="search-input-container-desktop">
              <input
                type="search"
                className="search-input-desktop"
                placeholder="Search"
                onChange={changeSearchInput}
                onKeyDown={onEnterSearchInput}
              />
              <button
                type="button"
                className="search-button-container-desktop"
                onClick={getJobs}
                data-testid="searchButton"
                aria-label="Search"
              >
                <BsSearch className="search-icon-desktop" />
              </button>
            </div>
            {renderAllJobs()}
          </div>
        </div>
      </div>
    </>
  )
}

export default Jobs
