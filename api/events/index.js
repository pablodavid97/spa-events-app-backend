const { getAll, add } = require('../util/event');
const {
    isValidText,
    isValidDate,
    isValidImageUrl,
} = require('../util/validation');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const events = await getAll();
            setTimeout(() => {
                res.status(200).json({ events });
            }, 2000);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'POST') {
        const data = req.body;
        let errors = {};

        if (!isValidText(data.title)) errors.title = 'Invalid title.';
        if (!isValidText(data.description))
            errors.description = 'Invalid description.';
        if (!isValidDate(data.date)) errors.date = 'Invalid date.';
        if (!isValidImageUrl(data.image)) errors.image = 'Invalid image.';

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({
                message: 'Adding the event failed due to validation errors.',
                errors,
            });
        }

        try {
            await add(data);
            setTimeout(() => {
                res.status(201).json({ message: 'Event saved.', event: data });
            }, 1500);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
