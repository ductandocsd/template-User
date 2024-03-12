import React, { useEffect, useState } from 'react';
import {Breadcrumb, Col, Container, Row, Table} from 'react-bootstrap';

import "./../../assets/pages/home.scss";
import {addDoc, collection, onSnapshot, query} from "firebase/firestore";
import {DBFirebase, storage} from "../../utils/firebase";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";

function CostumeAdd () {

    const [item, setItem] = useState({});
    const [name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [nameproduct, setNameProduct] = useState("");





    const loginSubmit = (e) => {
        e.preventDefault();
        handleValidation().then(r => {});
    }


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
            },
            (err) => console.log(err),
        );
    }

    const handleValidation = async (event)  => {
        console.log('=============== CHECK');

        let results = await addDoc(collection(DBFirebase, 'bill'), {
            name: name,
            address: address,
            phone: phone,
            nameproduct: nameproduct,

        });

        let resultsProducts = await addDoc(collection(DBFirebase, 'bill'), {
            p_name: name,
            p_location: address,
            p_phone: phone,
            p_nameproduct: nameproduct,

        });

        window.location.href = '/trang-phuc';
    }

    useEffect(() => {

    }, []);

    return (
        <div style={{ minHeight: "60vh"}}>
            <Container className={'auth'} style={{ minHeight: "60vh"}}>
                <Row>
                    <Col xl={12}>
                        <div className='breadcrumbs mt-2'>
                            <Breadcrumb>
                                <Breadcrumb.Item to="/">Trang chủ</Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Trang Phục Thời Thượng 
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active>Order</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </Col>
                    <Col xl={{span: 6, offset: 3}}>
                        <form  onSubmit={loginSubmit} className="mb-5">
                            <div className="form-group mb-3">
                                <label>Tên trang phục</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    placeholder="Name"
                                    onChange={(event) => setName(event.target.value)}
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

export default CostumeAdd;
