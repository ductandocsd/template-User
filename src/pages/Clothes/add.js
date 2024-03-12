import React, { useEffect, useState } from 'react';
import {Breadcrumb, Button, Col, Container, Form, Image, Row, Table} from 'react-bootstrap';

import "./../../assets/pages/home.scss";
import {addDoc, collection, deleteDoc, doc, onSnapshot, query, getDoc} from "firebase/firestore";
import {ref,uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {DBFirebase, storage} from "../../utils/firebase";
import {Link, useParams} from "react-router-dom";
import formatPrice from "../utils/util_price";

function ClothesAdd () {
    const [item, setItem] = useState({});
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [file, setFile] = useState(null);
    const [address, setAddress] = useState("");
    const [nameproduct, setNameProduct] = useState("");

    const { id, type } = useParams();
    const loginSubmit = (e) => {
        e.preventDefault();
        handleValidation().then(r => {});
    }

    // progress
    const [percent, setPercent] = useState(0);

    // Handle file upload event and update state
    const handleChange = async(event) => {
        let file = event.target.files[0];
        const storageRef = ref(storage, `/files/${file.name}`);

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                // update progress
                setPercent(percent);
            },
        );
    }

    const getById = async(id) => {
        console.log('----------------- item: ', id);
        console.log('----------------- item: ', type);
        const docRef = doc(DBFirebase, type, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setItem(docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        console.log('=============== product: ', docRef);
    }


    const handleValidation = async (event)  => {
        // console.log('=============== CHECK avatar', avatar);
        let results = await addDoc(collection(DBFirebase, 'bill'), {
            name: name,
            address: address,
            phone: phone,
            nameproduct: nameproduct,


        });

        console.log('------------- results:clothes ', results)

        let resultsProducts = await addDoc(collection(DBFirebase, 'bill'), {
            p_name: name,
            p_location: address,
            p_phone: phone,
            p_nameproduct: nameproduct,


        });

        window.location.href = '/ao-quan';
    }

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user)
        {
            window.location.href = '/auth/login';
        }

        getById(id);

    }, [id]);

    return (
        <div style={{ minHeight: "60vh"}}>
            <Container className={'auth'} style={{ minHeight: "60vh"}}>
                <Row>
                    <Col xl={12}>
                        <div className='breadcrumbs mt-2'>
                            <Breadcrumb>
                                <Breadcrumb.Item to="/">Trang chủ</Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    ÂU Phục
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active>Oder</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </Col>
                    <Col xl={{span: 6}}>
                        <div style={{ width: '70%',margin: '25px auto'}}>
                            <Image src={item?.avatar} rounded  style={{ height: '300px', objectFit: 'cover', width: '100%'}}/>
                            <h4 style={{ margin: '15px 0', textTransform: 'capitalize'}}>{item?.name}</h4>
                            <div className={'d-flex justify-content-between align-items-center'}>
                                <p style={{ margin: 0, fontWeight: '500'}}>Giá: {formatPrice(item?.price)}</p>
                            </div>
                        </div>
                    </Col>
                    <Col xl={{span: 6}}>
                        <form  onSubmit={loginSubmit} className="mb-5">
                            <div className="form-group mb-3 mt-3">
                                <label>Tên người đặt</label>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    name="name"
                                    placeholder="Name"
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Tên sản phẩm</label>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    name="nameproduct"
                                    placeholder="Nameproduct"
                                    onChange={(event) => setNameProduct(event.target.value)}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    name="address"
                                    placeholder="Địa chỉ"
                                    onChange={(event) => setAddress(event.target.value)}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    name="phone"
                                    placeholder="SĐT"
                                    onChange={(event) => setPhone(event.target.value)}
                                />
                            </div>

                            <div className={'d-flex justify-content-between align-items-center'}>
                                <button type="submit" className="btn btn-primary">
                                    Thanh Toán
                                </button>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ClothesAdd;
