using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchemeController : ControllerBase
    {
        private DbCollectionContext db;

        public SchemeController(DbCollectionContext db)
        {
            this.db = db;
        }

        [HttpGet]
        public IActionResult GetTopProductParkList()
        {
            return Ok((from scheme in db.Schemes
                       where scheme.ParentId == 0
                       select new
                       {
                           scheme.Id,
                           scheme.Nam
                       }).ToList());
        }

        [HttpGet("GetProductParkTree")]
        public IActionResult GetProductParkTreeTable(int productParkId)
        {
            var resultTable = (from scheme in db.Schemes
                               where scheme.Id == productParkId
                               select new
                               {
                                   scheme.Id,
                                   scheme.ParentId,
                                   scheme.TipNpoId,
                                   scheme.Nam,
                                   scheme.NpoId,
                               }).ToList();

            for (int index = 0; index < resultTable.Count; index++)
            {
                var forAdd = (from scheme in db.Schemes
                              where scheme.ParentId == resultTable[index].Id
                              select new
                              {
                                  scheme.Id,
                                  scheme.ParentId,
                                  scheme.TipNpoId,
                                  scheme.Nam,
                                  scheme.NpoId
                              }).ToList();

                resultTable.AddRange(forAdd);
            }

            return Ok(resultTable);
        }

        [HttpGet("GetObjectInfo")]
        public IActionResult GetObjectFullInfo(int objectId)
        {
            var result = (from scheme in db.Schemes
                          where scheme.Id == objectId
                          select new
                          {
                              scheme.Id,
                              scheme.ParentId,
                              TipNpoName = scheme.TipNpo.Name,
                              scheme.FlSx,
                              scheme.Ctip,
                              scheme.Nam,
                              scheme.NpoId
                          }).FirstOrDefault();

            return Ok(result);
        }
    }
}
