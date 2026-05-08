import React, { useEffect } from "react";
import icon from "../../../assets/images/icon.png";
import { useDispatch, useSelector } from "react-redux";
import { getAllAppointmentSlice } from "../../../redux/slice/appointment";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeAppointmentApi } from "../../../redux/api/appointment";
import { Local_User } from "../../layout/LocalUser";

const Appointments = () => {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state?.appointment);

  useEffect(() => {
    dispatch(getAllAppointmentSlice());
  }, [dispatch]);

  const handleCancel = async (id) => {
    try {
      const res = await removeAppointmentApi(id);
      if (res.data.success) {
        toast.success("Appointment canceled successfully!");
        dispatch(getAllAppointmentSlice());
      }
    } catch (error) {
      toast.error("Error canceling appointment!");
    }
  };

  // ✅ Bug Fix - pehle filter, phir sort
  const sortedAppointments = appointments
    .filter(a => a?.user?._id === Local_User?._id)
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  return (
    <div>
      {loading ? (
        <h6 className="text-center py-5">Loading...</h6>
      ) : (
        <section className="section team-area pt-80 pb-40 bg-gray">
          <div className="container">
            <div className="row mb-30">
              <div className="col-lg-7 col-md-8 col-sm-10 col-xs-12 t-center mb-40">
                <h2 className="section-title mb-20 font-22 t-uppercase">
                  Your Appointments
                </h2>
                <div className="heart-line">
                  <img src={icon} alt="Heart Icon" />
                </div>
              </div>
            </div>

            <div className="team-members row">
              {/* ✅ Bug Fix - empty check */}
              {sortedAppointments?.length === 0 ? (
                <p className="text-center py-4">Koi appointment nahi mili</p>
              ) : (
                sortedAppointments.map((item, index) => (
                  <div className="col-md-3 col-sm-6 mb-4" key={index}>
                    <div className="single-member card">
                      <div className="single-member-content card-body">
                        <h5 className="mb-2 font-15 t-uppercase">
                          {`${item.firstName} ${item.lastName}`}
                        </h5>
                        <h6 className="color-mid font-12 t-uppercase mb-2">
                          <small>Booked by: </small>
                          {item?.user?.name}
                        </h6>
                        <h6 className="color-mid font-12 t-uppercase mb-2">
                          <small>Doctor: </small>
                          {item?.doctor?.name ?? 'Doctor assign nahi hua'}
                        </h6>
                        <p>Name: {item?.firstName} {item?.lastName}</p>
                        <p>Email: {item?.email}</p>
                        <p>Phone: {item?.phoneNumber}</p>
                        <p>Gender: {item?.gender}</p>
                        <p>
                          Appointment Date:{" "}
                          {moment(item.appointmentDate).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </p>
                        <p>Message: {item?.message}</p>
                        <button
                          className="btn btn-danger btn-sm mt-3"
                          onClick={() => handleCancel(item._id)}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} /> Cancel Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Appointments;