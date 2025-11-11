import "./Css/ChatProfileDetails.css";

export const ChatProfileDetails = ({setChatProfileDetailsShow}) => {   

  return (
    <div className="chat-profile-details-wrapper position-fixed">
        <i onClick={() => setChatProfileDetailsShow(false)} className="bi bi-x position-absolute"></i>

        <div className="coisdejnkfrhewir">
            <div className="dcsdfnhrtdfsv p-3">
                <img src="/images/logo.png" className="bg-white p-2 rounded-2 mb-2" alt="" />

                <h6 className="mb-1 text-white">VinHem Fashion CRM Support</h6>

                <p className="mb-0 text-white">Typically replies within 7 minutes</p>
            </div>

            <div className="domwejewrwer bg-white px-3 py-2">
                <div className="doiewnjrwerwer bg-white px-2 py-3">
                    <div className="doewkmjrewr admn-msge d-flex align-items-center mb-4">
                        <div className="imjdeqr text-center text-white rounded-pill me-1">
                            <p className="mb-0">VF</p>
                        </div>

                        <div className="doejwrkmwer">
                            <p className="mb-0">VinHem Fashion Pvt. Ltd</p>

                            <div className="dowerwerr p-3 rounded-end-4 rounded-bottom-4 rounded-top-1">
                                <h6 className="mb-0">Welcome to VinHem Fashion! How can I help you?</h6>
                            </div>
                        </div>
                    </div>

                    <div className="doewkmjrewr user-msge d-flex flex-row-reverse align-items-center">
                        <div className="imjdeqr text-center text-white rounded-pill ms-1">
                            <p className="mb-0">Me</p>
                        </div>

                        <div className="doejwrkmwer">
                            <div className="dowerwerr p-3 rounded-end-1 rounded-bottom-4 rounded-start-4">
                                <h6 className="mb-0">Welcome to VinHem Fashion! How can I help you?</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="depjorierer position-relative">
                <textarea name="" id="" className="form-control rounded-0" placeholder="Reply here..."></textarea>

                <div className="doiewjrmwerwer position-absolute d-flex align-items-center top-50 end-0 translate-middle-y">
                    <i class="bi p-2 h-100 bi-paperclip"></i>

                    <i class="bi p-2 h-100 bi-emoji-smile"></i>
                </div>
            </div>
        </div>
    </div>
  )
}