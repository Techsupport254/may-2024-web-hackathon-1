import PropTypes from "prop-types";

const ProductFaq = ({ faqData }) => {
	return (
		<div className="FAQs">
			{faqData?.faqs.map((faq) => (
				<div className="FaqItem" key={faq.id}>
					<h3>
						{faq.question}
						<small>{new Date(faq.timestamp).toLocaleDateString()}</small>
						<small>
							<i className="fas fa-tag"></i> {faq.category}
						</small>
						<small className="faqStatus">
							<i className="fas fa-comments"></i>
							{faq.status}
							{faq.responses.length}
						</small>
					</h3>

					<div className="Responses">
						<h3>Responses:</h3>
						{faq.responses.map((response) => (
							<div className="FaqResponses" key={response.id}>
								<p>{response.response}</p>
								<p>
									{response.user}
									<small>
										{new Date(response.timestamp).toLocaleDateString()}
									</small>
									<small>{response.status}</small>
								</p>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default ProductFaq;

// validate props
ProductFaq.propTypes = {
	faqData: PropTypes.object.isRequired,
};
