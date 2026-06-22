import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-red-600 mb-4">RoktoBondhu</h1>

      <p className="text-lg text-gray-700 mb-8">
        RoktoBondhu connects people who need blood with willing donors across
        Bangladesh. Register as a donor, search by blood group, or post an
        urgent request when someone you know needs help.
      </p>

      <div className="flex flex-col gap-4">
        <Link
          href="/register"
          className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 w-full sm:w-auto text-center"
        >
          Register as Donor
        </Link>
        <Link
          href="/search"
          className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 w-full sm:w-auto text-center"
        >
          Find a Donor
        </Link>
        <Link
          href="/request"
          className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 w-full sm:w-auto text-center"
        >
          Post a Blood Request
        </Link>
        <Link
          href="/requests"
          className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 w-full sm:w-auto text-center"
        >
          View Open Requests
        </Link>
      </div>
    </div>
  );
}
