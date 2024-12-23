const { get, replace, remove } = require('../../data/event');
const {
    isValidText,
    isValidDate,
    isValidImageUrl,
} = require('../../util/validation');

module.exports = async (req, res) => {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const event = await get(id);
            res.status(200).json({ event });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'PATCH') {
        const data = req.body;
        let errors = {};

        if (!isValidText(data.title)) errors.title = 'Invalid title.';
        if (!isValidText(data.description))
            errors.description = 'Invalid description.';
        if (!isValidDate(data.date)) errors.date = 'Invalid date.';
        if (!isValidImageUrl(data.image)) errors.image = 'Invalid image.';

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({
                message: 'Updating the event failed due to validation errors.',
                errors,
            });
        }

        try {
            await replace(id, data);
            res.status(200).json({ message: 'Event updated.', event: data });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'DELETE') {
        try {
            await remove(id);
            res.status(200).json({ message: 'Event deleted.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
