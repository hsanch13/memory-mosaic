import React from 'react'

function SignUp() {
    return (
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Create your account</h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" action="#" method="POST">
                    <div>
                        <label for="full-name" class="block text-sm font-medium text-gray-900">Full Name</label>
                        <div class="mt-2">
                            <input type="text" name="full-name" id="full-name" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" />
                        </div>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-900">Email Address</label>
                        <div class="mt-2">
                            <input type="email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" />
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
                        <div class="mt-2">
                            <input type="password" name="password" id="password" autocomplete="new-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
                    </div>
                </form>

                <p class="mt-10 text-center text-sm text-gray-500">
                    Already have an account?
                    <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Sign in</a>
                </p>
            </div>
        </div>

    )
}

export default SignUp