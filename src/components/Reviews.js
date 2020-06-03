import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import Mark from 'mark.js';

const Reviews = ({ filterText, setFilterText }) => {
    const location = useLocation();
    const history = useHistory();
    const users = useSelector(state => state.users);
    const reviews = useSelector(state => state.reviews);
    const columns = [
        {
            name: 'Sent',
            format: row => new Date(row.attributes.createdAt).toLocaleDateString(),
            selector: 'attributes.createdAt',
            sortable: true,
            width: '95px',
        }, 
        {
            name: 'By',
            cell: row => { return(<a type="button" onClick={clickAuthor} rel={row.authorId}>{row.author}</a>) },
            selector: 'owner',
            sortable: true,
            compact: true,
            maxWidth: '150px'
        },
        {
            name: 'For',
            cell: row => { return(<a type="button" onClick={clickSubject} rel={row.subjectId}>{row.subject}</a>) },
            selector: 'subject',
            sortable: true,
            compact: true,
            maxWidth: '150px'
        },
        {
            name: 'Rating',
            cell: row => { return ( row.stars ) },
            selector: 'attributes.rating',
            sortable: true,
            compact: true,
            //right: true,
            width: '70px',
        },
        {
            name: 'Review',
            selector: 'attributes.content',
            sortable: true,
            compact: false,
        },  
    ];
    const customStyles = {
        headCells: {
            style: {
                fontWeight: 'bold',
            },
        }
    };
    
    const filterReview = (review) => {
        const terms = filterText.toLowerCase().split(',');
        var retVal = terms.length === 0 || terms[0].length === 0 ? true : false;

        for(var i = 0; i < terms.length && terms[i].length > 0 && retVal === false; i++) {
            retVal = review.author.toLowerCase().search(terms[i]) !== -1 ||
                    review.subject.toLowerCase().search(terms[i]) !== -1 ||
                    review.id.uuid.toLowerCase().search(terms[i]) !== -1 
        }

        return retVal;
    }

    const clickAuthor = (e) => {
        const user = users.filter(user => user.id.uuid === e.target.rel);
        
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/users?search=' + user[0].attributes.email);
    }

    const clickSubject = (e) => {
        const user = users.filter(user => user.id.uuid === e.target.rel);
    
        // This set the state for this location
        history.replace(location.pathname, { filterText: filterText });

        // This then redirects using the query to update filterText
        history.push('/users?search=' + user[0].attributes.email);
    }
    
    useEffect(() => {
        var instance = new Mark("div.animated");

        // Update the search filter according to router
        if(location.search.indexOf('search') !== -1) {
            setFilterText(location.search.substr(location.search.indexOf('=')+1));
            location.search = '';
            location.state = null;
        }
        else if(location.state !== null && location.state.filterText !== undefined) {
            setFilterText(location.state.filterText);
            location.state = null;
        } 

        for(const term of filterText.split(',')) {
            instance.mark(term, { 
                'element': 'span', 
                'className': 'markYellow',              
            });
        }
    })

    const reviewsPlus = () => {
        reviews.forEach(review => {
            const a = users.filter(user => review.relationships.author.data.id.uuid === user.id.uuid);
            review.author = a[0].attributes.profile.firstName + ' ' + a[0].attributes.profile.lastName;
            review.authorId = a[0].id.uuid;

            const s = users.filter(user => review.relationships.subject.data.id.uuid === user.id.uuid);
            review.subject = s[0].attributes.profile.firstName + ' ' + s[0].attributes.profile.lastName;
            review.subjectId = s[0].id.uuid;

            var k = [];
            var j = <span className="fa fa-star checked"></span>;
            for(var i = 0; i < review.attributes.rating; i++) {
                k.push(j)
            }
            review.stars = k;
        })

        return reviews;
    }

    const data = useMemo(() => reviewsPlus(), [users, reviews])

    return (
        <div className="animated fadeIn">
            <DataTable
                title = 'Reviews'
                columns = { columns }
                data = { data.filter(review => filterReview(review)) }
                keyField = 'id.uuid'
                dense
                highlightOnHover
                pointerOnHover
                customStyles = { customStyles }
                fixedHeader
                fixedHeaderScrollHeight = '85vh'
                noHeader
                defaultSortField = 'attributes.createdAt' 
                defaultSortAsc = { false }         
            />
        </div>
    )
}

export default Reviews;