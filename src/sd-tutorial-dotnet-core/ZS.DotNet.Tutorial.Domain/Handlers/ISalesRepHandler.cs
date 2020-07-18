using System;
using System.Collections.Generic;
using System.Text;
using ZS.DotNet.Tutorial.Model;

namespace ZS.DotNet.Tutorial.Domain.Handlers
{
    public interface ISalesRepHandler
    {
        IList<SalesRep> GetAll();
    }
}
