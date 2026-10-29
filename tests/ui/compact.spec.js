import {test,expect} from '@playwright/test';
test('统计折叠、紧凑行高、拖动分行与独立保存',async({page})=>{
 await page.goto('/');const height=await page.locator('.category').first().evaluate(e=>e.getBoundingClientRect().height);
 await page.locator('#toggleStats').click();await expect(page.locator('#projectStats')).toBeHidden();await expect(page.locator('#toggleStats')).toHaveAttribute('aria-expanded','false');
 await page.locator('#compactMode').check();await expect(page.locator('#showTaskDates')).not.toBeChecked();expect(await page.locator('.category').first().evaluate(e=>e.getBoundingClientRect().height)).toBe(height/2);await expect(page.locator('.task').first()).toHaveCSS('height','24px');
 const r=await page.locator('[data-task="b"]').boundingBox();await page.mouse.move(r.x+30,r.y+12);await page.mouse.down();await page.mouse.move(r.x+30,r.y+12-32,{steps:8});await page.mouse.up();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('gantt-studio-v1')));expect(state.categories[0].rows).toBe(3);
 await page.reload();await expect(page.locator('#compactMode')).toBeChecked();await expect(page.locator('#projectStats')).toBeHidden();await page.locator('#compactMode').uncheck();await expect(page.locator('.task').first()).toHaveCSS('height','48px');await page.locator('#toggleStats').click();await expect(page.locator('#projectStats')).toBeVisible();
});
