import React from 'react';
import { render, screen, waitFor, within} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
import DisplayComponent from './DisplayComponent';

test('renders without errors', () => {
    render(<ContactForm />)
});

test('renders the contact form header', () => {
    render(<ContactForm />)
    const header = screen.getByText(/contact form/i)
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent('Contact Form')
});

test('renders ONE error message if user enters less than 5 characters into firstname.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText('First Name*');
    userEvent.type(firstNameInput, 'ab');

    await waitFor(() => {
        const firstNameError = screen.queryByText(/must have at least 4 characters/i);
        const errorMessage = screen.queryAllByTestId('error')
        expect(firstNameError).toBeInTheDocument();
        expect(errorMessage).toHaveLength(1);
    })

    
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    
    await waitFor(() => {
        const errorMessages = screen.queryAllByTestId('error');
        expect(errorMessages).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText('First Name*');
    const lastNameInput = screen.getByLabelText('Last Name*');
    const submitButton = screen.getByRole('button');
    userEvent.type(firstNameInput, 'Milhouse');
    userEvent.type(lastNameInput, 'McGoon');
    userEvent.click(submitButton);

    await waitFor(() => {
        const errorMessage = screen.queryAllByTestId('error');
        expect(errorMessage).toHaveLength(1);
    })

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />)
    const emailInput = screen.getByLabelText('Email*');
    userEvent.type(emailInput, 'notarealemail');
    expect(screen.getByText(/email must be a valid email address/i)).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText('First Name*');
    const emailInput = screen.getByLabelText('Email*');
    const submitButton = screen.getByRole('button');
    userEvent.type(firstNameInput, 'George');
    userEvent.type(emailInput, 'email@website.com');
    userEvent.click(submitButton);
    await waitFor(() => {
        const lastNameError = screen.getByText(/lastname is a required field/i);
        expect(lastNameError).toBeInTheDocument();
    })


});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText('First Name*');
    const lastNameInput = screen.getByLabelText('Last Name*');
    const emailInput = screen.getByLabelText('Email*');
    const submitButton = screen.getByRole('button');
    userEvent.type(firstNameInput, 'George');
    userEvent.type(lastNameInput, 'Smith');
    userEvent.type(emailInput, 'funGuy@gmail.com');
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.getByText('First Name:'); 
        const lastNameDisplay = screen.getByText('Last Name:');
        const emailDisplay = screen.getByText('Email:');
        const messageDisplay = screen.queryByText('Message:');
        expect(firstNameDisplay).toBeVisible();
        expect(lastNameDisplay).toBeVisible();
        expect(emailDisplay).toBeVisible();
        expect(messageDisplay).toBeFalsy();
 
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />)
    const firstNameInput = screen.getByLabelText('First Name*');
    const lastNameInput = screen.getByLabelText('Last Name*');
    const emailInput = screen.getByLabelText('Email*');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByRole('button');
    userEvent.type(firstNameInput, 'George');
    userEvent.type(lastNameInput, 'Smith');
    userEvent.type(emailInput, 'funGuy@gmail.com');
    userEvent.type(messageInput, 'Hey, look! Here is a message!')
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.getByText('First Name:'); 
        const lastNameDisplay = screen.getByText('Last Name:');
        const emailDisplay = screen.getByText('Email:');
        const messageDisplay = screen.queryByText('Message:');
        expect(firstNameDisplay).toBeVisible();
        expect(lastNameDisplay).toBeVisible();
        expect(emailDisplay).toBeVisible();
        expect(messageDisplay).toBeVisible();
 
    })
    

});
