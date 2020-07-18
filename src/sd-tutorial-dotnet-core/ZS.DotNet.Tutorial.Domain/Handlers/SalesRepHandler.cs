using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ZS.DotNet.Tutorial.Model;

namespace ZS.DotNet.Tutorial.Domain.Handlers
{
    public class SalesRepHandler:ISalesRepHandler
    {
        public IList<SalesRep> GetAll()
        {
            IList<SalesRep> dummySalesValue = new List<SalesRep>{new SalesRep
            {

                Id = 4,
                Name = "Mithali",
                Country = "india",
                City = "mumbai",
                Zipcode = "2211012",
                Gender = "F"
            },
                new SalesRep
                    {
                    Id = 6,
                    Name = "Sachin",
                    Country = "india",
                    City = "mumbai",
                    Zipcode = "2211012",
                    Gender = "M"

                },
                new SalesRep
                {
                    Id = 7,
                    Name = "Ramesh",
                    Country = "india",
                    City = "mumbai",
                    Zipcode = "2211012",
                    Gender = "M"

                },
                new SalesRep
                {
                    Id = 8,
                    Name = "Manisha",
                    Country = "india",
                    City = "mumbai",
                    Zipcode = "2211012",
                    Gender = "F"

                },
                new SalesRep
                {
                    Id = 9,
                    Name = "Mandar",
                    Country = "india",
                    City = "nagpur",
                    Zipcode = "2200012",
                    Gender = "M"

                },
                new SalesRep
                {
                    Id = 10,
                    Name = "ved",
                    Country = "india",
                    City = "Pune",
                    Zipcode = "2211012",
                    Gender = "M"

                },
                new SalesRep
                {
                    Id = 11,
                    Name = "Ravi",
                    Country = "india",
                    City = "mumbai",
                    Zipcode = "2211012",
                    Gender = "M"

                },
                new SalesRep
                {
                    Id = 12,
                    Name = "Sreeraj",
                    Country = "india",
                    City = "mumbai",
                    Zipcode = "2211012",
                    Gender = "M"

                }
            };
            return dummySalesValue.ToList();

        }
    }
}
