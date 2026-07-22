"use client";

import {
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import {
    useState,
    ChangeEvent,
    FormEvent,
} from "react";


export default function ContactPage() {


    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState("");


    const [form, setForm] = useState({

        name: "",
        email: "",
        subject: "",
        message: "",

    });





    function handleChange(
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value,

        });

    }







    async function handleSubmit(
        e: FormEvent
    ) {

        e.preventDefault();


        setLoading(true);

        setStatus("");



        try {


            const res = await fetch(
                "/api/contact",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                    },


                    body: JSON.stringify(form),

                }
            );



            const data =
                await res.json();




            if (!res.ok) {

                throw new Error(
                    data.error ||
                    "Failed to send message"
                );

            }



            setStatus(
                "✅ Message sent successfully!"
            );



            setForm({

                name: "",
                email: "",
                subject: "",
                message: "",

            });




        } catch (error) {


            setStatus(
                "❌ Something went wrong. Try again."
            );


        } finally {

            setLoading(false);

        }


    }






    return (

        <div className="min-h-screen bg-gray-50">


            {/* Hero */}

            <section className="bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 py-20 text-white">


                <div className="container mx-auto px-6 text-center">


                    <h1 className="text-4xl font-bold md:text-6xl">

                        Contact SewaHub Nepal

                    </h1>



                    <p className="mx-auto mt-5 max-w-2xl text-blue-100">

                        Have questions or need support?
                        Our team is ready to help.

                    </p>


                </div>


            </section>







            <section className="py-16">


                <div className="container mx-auto grid gap-10 px-6 md:grid-cols-2">





                    {/* Contact Info */}


                    <div className="space-y-6">


                        <h2 className="text-3xl font-bold">

                            Get in Touch

                        </h2>



                        <p className="text-gray-600">

                            Whether you are looking for
                            trusted professionals or want
                            to join SewaHub as a provider,
                            contact us anytime.

                        </p>





                        <Card>

                            <CardContent className="space-y-5 p-6">


                                <div className="flex items-center gap-4">

                                    <MapPin className="text-blue-600" />

                                    <span>
                                        Kathmandu, Nepal
                                    </span>

                                </div>




                                <div className="flex items-center gap-4">

                                    <Mail className="text-blue-600" />

                                    <span>
                                        support@sewahub.com
                                    </span>

                                </div>





                                <div className="flex items-center gap-4">

                                    <Phone className="text-blue-600" />

                                    <span>
                                        +977 9800000000
                                    </span>

                                </div>



                            </CardContent>

                        </Card>



                    </div>









                    {/* Contact Form */}


                    <Card>


                        <CardContent className="p-6">


                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >




                                <Input

                                    name="name"

                                    value={form.name}

                                    onChange={handleChange}

                                    placeholder="Your name"

                                    required

                                />





                                <Input

                                    name="email"

                                    type="email"

                                    value={form.email}

                                    onChange={handleChange}

                                    placeholder="Your email"

                                    required

                                />







                                <Input

                                    name="subject"

                                    value={form.subject}

                                    onChange={handleChange}

                                    placeholder="Subject"

                                    required

                                />








                                <Textarea

                                    name="message"

                                    value={form.message}

                                    onChange={handleChange}

                                    placeholder="Your message"

                                    rows={6}

                                    required

                                />







                                <Button

                                    type="submit"

                                    disabled={loading}

                                    className="w-full bg-blue-600 hover:bg-blue-700"

                                >

                                    {loading
                                        ? "Sending..."
                                        : "Send Message"
                                    }


                                </Button>






                                {status && (

                                    <p className="text-center text-sm">

                                        {status}

                                    </p>

                                )}



                            </form>


                        </CardContent>


                    </Card>






                </div>


            </section>



        </div>


    );

}