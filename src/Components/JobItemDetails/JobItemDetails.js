import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { BsFillBriefcaseFill, BsStarFill } from "react-icons/bs";
import { BiLinkExternal } from "react-icons/bi";
import { MdLocationOn } from "react-icons/md";
import Header from "../Header/Header";
import SimilarJobItem from "../SimilarJobItem/SimilarJobItem";
import SkillsCard from "../SkillsCard/SkillsCard";
import "./JobItemDetails.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const JobItemDetails = () => {
  const [jobData, setJobData] = useState({});
  const [similarJobsData, setSimilarJobsData] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const { id } = useParams(); 

  useEffect(() => {
    getJobData();
  }, [id]); 

  const getFormattedSimilarData = (data) => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  });

  const getFormattedData = (data) => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    rating: data.rating,
    title: data.title,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map((eachSkill) => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  });

  const getJobData = async () => {
    setApiStatus(apiStatusConstants.inProgress);

    const jwtToken = Cookies.get("jwt_token");
    const url = `https://apis.ccbp.in/jobs/${id}`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      const updatedData = getFormattedData(data.job_details);
      const updatedSimilarJobsData = data.similar_jobs.map((eachSimilarJob) =>
        getFormattedSimilarData(eachSimilarJob)
      );
      setJobData(updatedData);
      setSimilarJobsData(updatedSimilarJobsData);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const renderFailureView = () => (
    <div className="job-item-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-item-failure-img"
      />
      <h1 className="job-item-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="job-item-failure-description">
        We cannot seem to find the page you are looking for
      </p>

      <button
        type="button"
        className="job-item-failure-button"
        onClick={getJobData}
      >
        Retry
      </button>
    </div>
  );

  const renderLoadingView = () => (
    <div className="job-item-loader-container" data-testid="loader">
    <h2>Loading</h2>
    </div>
  );

  const renderJobDetailsView = () => {
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobData;
    const { description, imageUrl } = lifeAtCompany;
    return (
      <div className="job-details-view-container">
        <div className="job-item">
          <div className="logo-title-location-container">
            <div className="logo-title-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="title-rating-container">
                <h1 className="title-heading">{title}</h1>
                <div className="rating-container">
                  <BsStarFill className="rating-icon" />
                  <p className="rating-heading">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-package-container">
              <div className="location-employee-container">
                <div className="location-container">
                  <MdLocationOn className="location-icon" />
                  <p className="location-heading">{location}</p>
                </div>
                <div className="employee-type-container">
                  <BsFillBriefcaseFill className="brief-case-icon" />
                  <p className="employee-type-heading">{employmentType}</p>
                </div>
              </div>
              <p className="package-heading">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="line" />
          <div className="description-visit-container">
            <h1 className="description-heading">Description</h1>
            <div className="visit-container">
              <a href={companyWebsiteUrl} className="visit-heading">
                Visit
              </a>
              <BiLinkExternal className="visit-icon" />
            </div>
          </div>
          <p className="description-text">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list-container">
            {skills.map((eachSkill) => (
              <SkillsCard skillDetails={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-description-image-container">
            <p className="life-at-company-description">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobsData.map((eachSimilarJob) => (
              <SimilarJobItem
                jobDetails={eachSimilarJob}
                key={eachSimilarJob.id}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderJobDetails = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderJobDetailsView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="job-item-details-container">{renderJobDetails()}</div>
    </>
  );
};

export default JobItemDetails;
