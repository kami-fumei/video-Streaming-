import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: function(value) {
                return this.subscriber.toString() !== value.toString();
            },
            message: "Subscriber and Channel cannot be the same user."
        }
    },
},
{timestamps: true});

export const SUBSCRIPTION = mongoose.model('Subscription', subscriptionSchema);