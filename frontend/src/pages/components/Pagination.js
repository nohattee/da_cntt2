import React from 'react';
import PropsTypes from 'prop-types';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

Pagination.propsTypes = {
    pagination: PropsTypes.object.isRequired,
    pageNumb: PropsTypes.object.int,
    onPageChange: PropsTypes.func,
}

Pagination.defaultProps = {
    onPageChange: null,
}

export default function Pagination(props) {
    const { pagination, onPageChange, pageNumb } = props;
    let { prev, next } = pagination;

    function handlePageNext(pageNumb) {
        if (onPageChange) {
            var page = pageNumb + 1;
            onPageChange(page.toString());
        }
    }

    function handlePagePrev(pageNumb) {
        if (onPageChange) {
            var page = pageNumb - 1;
            onPageChange(page.toString());
        }
    }


    return (
        <div className='pagination flex space-x-10 justify-center text-2xl mb-10'>
            {
                parseInt(prev) !== 0 ?
                    (<div className='previous flex transition duration-150 transform hover:-translate-x-6'>
                        <IoChevronBack className='mt-1.5 mr-2' />
                        <button
                            disabled={prev == null}
                            onClick={() => handlePagePrev(pageNumb)}
                            className='focus:outline-none text-black'>
                            Previous
                        </button>
                    </div>) : ('')
            }
            {
                parseInt(next) !== 0 ?
                    (<div className='next flex transition duration-150 transform hover:translate-x-6'>
                        <button
                            disabled={next == null}
                            onClick={() => handlePageNext(pageNumb)}
                            className='focus:outline-none text-black'>
                            Next
                        </button>
                        <IoChevronForward className='mt-1.5 ml-2' />
                    </div>) : ('')
            }
        </div>
    )
}