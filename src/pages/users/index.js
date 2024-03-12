import React, { useEffect, useState } from 'react';
import {Button, Col, Container, Image, Row, Table} from 'react-bootstrap';

import "./../../assets/pages/home.scss";
import {collection, query, doc, onSnapshot, deleteDoc} from "firebase/firestore"
import { DBFirebase} from "../../utils/firebase";
import ProductItemLoadingCpn from "../../components/product/_inc_product_item_loading";
import ProductItem from "../../components/product/_inc_product_item";
import {Link} from "react-router-dom";
import formatPrice from "../utils/util_price";


function UserPage () {
    const [users, setUsers] = useState([]);

    const deleteItem = async(item) => {
        const user = doc(DBFirebase, 's_products', item.id)
        try{
            await deleteDoc(user)
        } catch (err) {
            alert(err)
        }
    }

    useEffect(() => {
        const q = query(collection(DBFirebase, 's_products'));
        onSnapshot(q, (querySnapshot) => {
            setUsers(querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
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
                    <div style={{ marginTop: '20px'}}>
                        <Col><h1 className='heading-h1 mt-2 mb-2'  style={{ paddingLeft: '40px'}}>Tất cả các mặt hàng</h1></Col>
                    </div>
                </Row>
                <Row>
                    { users.length === 0 ? (
                        <p>Dữ liệu đang cập nhật</p>
                    ) : (
                        <>
                            { users && users.map( ( item, index ) => (
                                <Col xs={4}>
                                    <div style={{ width: '80%',margin: '25px auto'}}>
                                        <Image src={item.data.p_imgs} rounded  style={{ height: '300px', objectFit: 'cover', width: '100%'}}/>
                                        <h4 style={{ margin: '15px 0', textTransform: 'capitalize'}}>{item.data.p_name}</h4>
                                        <div className={'d-flex justify-content-between align-items-center'}>
                                            <p style={{ margin: 0, fontWeight: '500'}}>Giá: {formatPrice(item.data.p_price)}</p>
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

export default UserPage;
