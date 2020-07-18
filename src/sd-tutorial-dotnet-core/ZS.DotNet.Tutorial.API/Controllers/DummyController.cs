using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ZS.Core.DataCore;
using ZS.DotNet.Tutorial.Domain.Handlers;
using ZS.OE.Commons.Providers;
using ZS.DotNet.Tutorial.Model;

namespace ZS.DotNet.Tutorial.API.Controllers
{
    
    
        [Route("api")]
        public class DummyController : Controller
        {

            protected Func<IUnitOfWork> UnitOfWorkFactory;

            protected readonly IUserProvider UserProvider;

            private readonly IDemoHandler _demoHandler;
            public DummyController(Func<IUnitOfWork> unitOfWorkFactory, IUserProvider userProvider, IDemoHandler demoHandler)
            {
                UnitOfWorkFactory = unitOfWorkFactory;
                UserProvider = userProvider;
                _demoHandler = demoHandler;
            }

           
            [Route("all")]
            [HttpGet]
            public IList<Dummy> GetAllRecord()

            {
                return _demoHandler.GetAllRecord()?.ToList();
            }
            [Route("add")]
            [HttpPost]
            public Dummy Add([FromBody] Dummy dummy)

            {
                
                    var result = _demoHandler.AddEntry(dummy);
                    return result;
                
           
            }
            [Route("update")]
            [HttpPost]
            public Dummy Update([FromBody] Dummy dummy)

            {

                var result = _demoHandler.Update(dummy);
                return result;


            }
            [Route("dummy")]
            [HttpGet]
            public string GetDummy()
            {
                    return "dummmy";
            }


        }
    
}
