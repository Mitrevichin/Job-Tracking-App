import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageBtnContainer';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAllJobsContext } from '../pages/AllJobs';

const PageBtnContainer = () => {
  const {
    data: { numOfPages, currentPage },
  } = useAllJobsContext();

  const pages = Array.from({ length: numOfPages }, (_, i) => i + 1);
  console.log(pages);

  return (
    <Wrapper>
      <button className='btn prev-btn'>
        <HiChevronDoubleLeft />
        Prev
      </button>
      <div className='btn-container'>
        {pages.map(pageNumber => {
          return (
            <button
              key={pageNumber}
              className={`btn page-btn ${
                pageNumber === currentPage && 'active'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
      <button className='btn next-btn'>
        Next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
