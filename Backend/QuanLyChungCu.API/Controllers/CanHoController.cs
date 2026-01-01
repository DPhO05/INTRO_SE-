using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChungCu.API.Entities;

namespace QuanLyChungCu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CanHoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CanHoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/CanHo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CanHoEntity>>> GetCanHo()
        {
            return await _context.CanHo.ToListAsync();
        }

        // POST: api/CanHo
        [HttpPost]
        public async Task<ActionResult<CanHoEntity>> PostCanHo(CanHoEntity canHo)
        {
            _context.CanHo.Add(canHo);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCanHo", new { id = canHo.MaCanHo }, canHo);
        }

        // PUT: api/CanHo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCanHo(int id, CanHoEntity canHo)
        {
            if (id != canHo.MaCanHo) return BadRequest();

            _context.Entry(canHo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.CanHo.Any(e => e.MaCanHo == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/CanHo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCanHo(int id)
        {
            var canHo = await _context.CanHo.FindAsync(id);
            if (canHo == null) return NotFound();

            _context.CanHo.Remove(canHo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}