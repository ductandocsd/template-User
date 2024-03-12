import React, { useEffect, useState } from 'react';
import {Button, Col, Container, Image, Row, Table} from 'react-bootstrap';

import "./../../assets/pages/home.scss";
import {Link} from "react-router-dom";
import {collection, deleteDoc, doc, onSnapshot, query} from "firebase/firestore";
import {DBFirebase} from "../../utils/firebase";
import formatPrice from "../utils/util_price";

function ClothesIndex () {

    const [listsData, setData] = useState([]);

    const deleteItem = async(item) => {
        console.log('----------------- item: ', item);
        const user = doc(DBFirebase, 'clothes', item.id)
        try{
            await deleteDoc(user)
        } catch (err) {
            alert(err)
        }
    }


    useEffect(() => {
        const q = query(collection(DBFirebase, 'clothes'));
        onSnapshot(q, (querySnapshot) => {
            setData(querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
            console.log('----------------- listsData', listsData);
        })

        const user = localStorage.getItem("user");
        if (!user)
        {
            window.location.href = '/auth/login';
        }
    }, []);

    return (
        <div style={{ minHeight: "60vh"}}>
            <Container>
                <Row>
                    <Col>
                        <div className={'d-flex justify-content-between align-items-center'} style={{ marginTop: '20px'}}>
                            <h1 style={{ paddingLeft: '40px'}} className='heading-h1 mt-2 mb-2' >Âu Phục</h1>
                        </div>
                    </Col>
                </Row>
                <Row>
                    { listsData.length === 0 ? (
                        <p>Dữ liệu đang cập nhật</p>
                    ) : (
                        <>
                            { listsData && listsData.map( ( item, index ) => (
                                <Col xs={4}>
                                    <div style={{ width: '80%',margin: '25px auto'}}>
                                        <Image src={item.data.avatar} rounded  style={{ height: '300px', objectFit: 'cover', width: '100%'}}/>
                                        <h4 style={{ margin: '15px 0', textTransform: 'capitalize'}}>{item.data.name}</h4>
                                        <h4 style={{ margin: '10px 0', textTransform: 'capitalize'}}>{item.data.description}</h4>
                                        <div className={'d-flex justify-content-between align-items-center'}>
                                            <p style={{ margin: 0, fontWeight: '500'}}>Giá: {formatPrice(item.data.price)}</p>
                                            <Button className={'btn btn-primary'}>
                                                <Link style={{ color: '#fff'}} to={`/them-moi-ao-quan/${item.id}/clothes`} className='nav-item'>Order</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            ) ) }

                        </>
                    ) }
                </Row>
            </Container>
        </div>
    );
}

export default ClothesIndex;
