import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import icon from "../../../assets/images/icon.png";
import img01 from "../../../assets/images/appointment/img-01.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { createAppointmentSlice } from "../../../redux/slice/appointment";
import { toast } from "react-toastify";
import { Local_User } from "../../layout/LocalUser";
import { BASE_URL } from "../../../utils/baseUrl";

const validationSchema = Yup.object().shape({
  user: Yup.string().required("User ID is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  gender: Yup.string().required("Gender is required"),
  appointmentDate: Yup.date().required("Appointment Date is required"),
  message: Yup.string().required("Message is required"),
  doctor: Yup.string().required("Doctor is required"),
});

const MakeAppointment = () => {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${BASE_URL}doctors/getAll`);
        setDoctors(res.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div>
      <section className="section appointment-area pt-60">
        <div className="container">
          <div className="row mb-30">
            <div className="col-lg-7 col-md-8 col-sm-10 col-xs-12 col-xs-center t-center mb-40">
              <h2 className="section-title mb-20 font-22 t-uppercase">
                MAKE AN APPOINTMENT
              </h2>
              <div className="heart-line">
                <img src={icon} alt="Awesome Image" />
              </div>
            </div>
          </div>
          <div className="row services">
            <div className="col-lg-6">
              <img src={img01} alt="" />
            </div>
            <div className="col-lg-6 ptb-40">
              <div className="appointment-form">
                <Formik
                  initialValues={{
                    user: Local_User?._id,
                    doctor: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    gender: "",
                    appointmentDate: "",
                    message: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    console.log("Form data submitted:", values);
                    setLoading(true);
                    try {
                      const response = await dispatch(
                        createAppointmentSlice(values)
                      );
                      console.log("response", response);

                      if (response.payload.success) {
                        resetForm();
                        toast.success(
                          response.message || "Appointment created successfully"
                        );
                        window.location.reload();
                      }
                      //  else {
                      //   toast.error(
                      //     response.message || "Failed to create appointment"
                      //   );
                      // }
                    } catch (error) {
                      console.error("Error creating appointment:", error);
                      toast.error(
                        "An error occurred while creating the appointment."
                      );
                    } finally {
                      setSubmitting(false);
                      setLoading(false);
                    }
                  }}
                >
                  {({ errors, touched, handleSubmit, setFieldValue }) => (
                    <Form onSubmit={handleSubmit}>
                      <div className="row row-tb-10 row-rl-10">
                        <div className="col-md-6">
                          <Field
                            type="text"
                            className={`form-control input-lg ${
                              errors.firstName && touched.firstName
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="First Name"
                            name="firstName"
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-md-6">
                          <Field
                            type="text"
                            className={`form-control input-lg ${
                              errors.lastName && touched.lastName
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Last Name"
                            name="lastName"
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-md-6">
                          <Field
                            type="email"
                            className={`form-control input-lg ${
                              errors.email && touched.email ? "is-invalid" : ""
                            }`}
                            placeholder="Address Email"
                            name="email"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-md-6">
                          <Field
                            type="text"
                            className={`form-control input-lg ${
                              errors.phoneNumber && touched.phoneNumber
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Phone Number"
                            name="phoneNumber"
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-md-6">
                          <Field
                            as="select"
                            className={`form-control input-lg ${
                              errors.gender && touched.gender
                                ? "is-invalid"
                                : ""
                            }`}
                            name="gender"
                          >
                            <option value="">Select Your Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Child">Child</option>
                          </Field>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-md-6">
                          <Field
                            type="date"
                            className={`form-control input-lg ${
                              errors.appointmentDate && touched.appointmentDate
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Appointment Date"
                            name="appointmentDate"
                          />
                          <ErrorMessage
                            name="appointmentDate"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-md-12">
                          <label htmlFor="doctor">Doctor</label>
                          <Field
                            as="select"
                            id="doctor"
                            name="doctor"
                            className={`form-control input-lg ${
                              errors.doctor && touched.doctor
                                ? "is-invalid"
                                : ""
                            }`}
                            onChange={(e) =>
                              setFieldValue("doctor", e.target.value)
                            }
                          >
                            <option value="">Select Doctor</option>
                            {doctors.map((doctor) => (
                              <option key={doctor._id} value={doctor._id}>
                                {doctor.name} - {doctor.specialty}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name="doctor"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-xs-12">
                          <Field
                            as="textarea"
                            className={`form-control input-lg ${
                              errors.message && touched.message
                                ? "is-invalid"
                                : ""
                            }`}
                            rows="7"
                            placeholder="Message"
                            name="message"
                          />
                          <ErrorMessage
                            name="message"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="col-xs-12">
                          {
                            loading ? (
                              <button
                              className="btn btn-lg btn-block"
                              disabled
                            >
                              Creating...
                            </button>
                            ):(
                              <button
                              className="btn btn-lg btn-block"
                              type="submit"
                            >
                              Create
                            </button>
                            )
                          }
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MakeAppointment;
