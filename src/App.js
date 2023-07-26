import { Configuration, OpenAIApi } from 'openai';
import FormSection from './components/FormSection';
import AnswerSection from './components/AnswerSection';
import { useState } from 'react';

const App = () => {
	const configuration = new Configuration({
		apiKey: '',
	});

	const openai = new OpenAIApi(configuration);

	const [storedValues, setStoredValues] = useState([]);

	const generateResponse = async (newQuestion, setNewQuestion) => {
		let options = {
			model: 'text-davinci-003',
			temperature: 0,
			max_tokens: 100,
			top_p: 1,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
			stop: ['/'],
		};

		// Add the context to the user-provided question
		const context = 'Answer this question with the context of it being about the University of Notre Dame';
		let completeOptions = {
			...options,
			prompt: `${context} ${newQuestion}`, // Concatenate the context with the user's question
		};

		const response = await openai.createCompletion(completeOptions);

		if (response.data.choices) {
			setStoredValues([
				{
					question: newQuestion,
					answer: response.data.choices[0].text,
				},
				...storedValues,
			]);
			setNewQuestion('');
		}
	};

	return (
		<div>
			<div className="header-section">
				<h1>Lost at Notre Dame</h1>
				{storedValues.length < 1 && (
					<p>
						Lost at Notre Dame is a free-to-use Chatbot app that acts as your interactive guide to explore everything about the University of Notre Dame. Powered by the cutting-edge Chatbot technology, specifically GPT-3.5, Lost at Notre Dame aims to provide users with an informative and engaging experience, giving them access to a vast pool of information related to the iconic university.
					</p>
				)}
			</div>

			<FormSection generateResponse={generateResponse} />

			{storedValues.length > 0 && <AnswerSection storedValues={storedValues} />}
		</div>
	);
};

export default App;
