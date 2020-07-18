using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ZS.Core.DataCore;
using ZS.DotNet.Tutorial.Domain.Handlers;
using ZS.DotNet.Tutorial.Model;
using ZS.OE.Commons.Providers;

namespace ZS.DotNet.Tutorial.API.Controllers
{


    [Route("api")]
    public class SalesRepController : Controller
    {

        protected Func<IUnitOfWork> UnitOfWorkFactory;

        protected readonly IUserProvider UserProvider;

        private readonly ISalesRepHandler _salesRepHandler;
        public SalesRepController(Func<IUnitOfWork> unitOfWorkFactory, IUserProvider userProvider, ISalesRepHandler salesRepHandler)
        {
            UnitOfWorkFactory = unitOfWorkFactory;
            UserProvider = userProvider;
            _salesRepHandler = salesRepHandler;

        }


        [Route("salesrep")]
        [HttpGet]
        public IList<SalesRep> GetAll()

        {

            return _salesRepHandler.GetAll();


        }

    }

}