import 'flowbite';
import Datepicker from 'flowbite-datepicker/Datepicker';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const dateInput = document.getElementById('datepickerId');
    if (dateInput) {
      new Datepicker(dateInput, {
        autohide: true,
        format: 'mm/dd/yyyy',
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-light">
      <div className="bg-white rounded-xl shadow-card p-8 max-w-lg w-full space-y-6">
        <h1 className="text-2xl font-heading text-primary">Qadence</h1>
        <p className="text-neutral">
          Frontend scaffold with Tailwind, WowDash, and Flowbite components.
        </p>

        {/* WowDash button */}
        <button className="px-4 py-2 rounded-lg font-semibold text-white bg-primary hover:bg-primary-dark">
          Get Started
        </button>

        {/* Flowbite Dropdown */}
        <div>
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            className="text-white bg-secondary hover:bg-secondary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            type="button"
          >
            Dropdown button
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          <div
            id="dropdown"
            className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
          >
            <ul
              className="py-2 text-sm text-gray-700"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Flowbite Modal Trigger */}
        <div>
          <button
            data-modal-target="defaultModal"
            data-modal-toggle="defaultModal"
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-yellow-600"
            type="button"
          >
            Open Modal
          </button>
        </div>

        {/* Modal */}
        <div
          id="defaultModal"
          tabIndex="-1"
          aria-hidden="true"
          className="hidden fixed top-0 right-0 left-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] max-h-full flex items-center justify-center"
        >
          <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-start justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Example Modal
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-hide="defaultModal"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-base leading-relaxed text-gray-500">
                  This is a Flowbite modal. You can use it for dialogs, forms,
                  or confirmations.
                </p>
              </div>
              <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button
                  data-modal-hide="defaultModal"
                  type="button"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Flowbite Datepicker */}
        <div>
          <label
            htmlFor="datepickerId"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Pick a date
          </label>
          <input
            type="text"
            id="datepickerId"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            placeholder="Select date"
          />
        </div>
      </div>
    </div>
  );
}
