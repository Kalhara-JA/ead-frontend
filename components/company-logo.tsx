import React from 'react';

const CompanyLogoSection = () => {
  const companies = [
    {
      name: "Slack",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy1qKW_LN_RTjEThxqOPooxesb3E3gdzT2bg&s",
    },
    {
      name: "Salesforce",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLH52v0KRugOh5DR4cVwjiQonH5_xq3yg2TQ&s",
    },
    {
      name: "Trello",
      logo: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSZ0KGB9FA59geiSZZgcf5cI_AWVbQpWKF6knivxLruR5U2JEWn",
    },
    {
      name: "Asana",
      logo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSbQTXu4LNKkVFjXwOQVDJ3Gh5ZZnWPagV_rjZlFOcMydbSXo0X",
    },
    {
      name: "Dropbox",
      logo: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRxJMODeCqBISnfHxNZ2jge4Rp8l3e8-qy9NlIMXbXFh2sRfnHA",
    },
    {
      name: "Zoom",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpZaABt9vGAjXTTSDc8XJ0JOkcN3bzHq0s3g&s",
    },
  ];

  return (
    <section className="w-full ">
      <div className="container px-4 md:px-6">
      <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-16">
          Trusted by Top Brands
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center">
          {companies.map((company, i) => (
            <div
              key={i}
              className="flex items-center justify-center p-4 bg-muted rounded-lg"
            >
              <img
                alt={`${company.name} logo`}
                className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                height="60"
                src={company.logo}
                width="120"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogoSection;
