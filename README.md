# Spectre: The Single-Page App Theme for Ghost v0.79

A Single-Page App Theme for Ghost, adding categories, subcategories, syntax highlighting, & a beautiful, touch-friendly interface.

## Using the Spectre Theme

The Spectre theme automatically adds many new features to Ghost, including:

1. Touch / Swipe Navigation
2. Keyboard Navigation
3. Menu Navigation
4. Categories / Subcategories
5. A Single-page application interface (No page reloads!)
6. Lightbox for images
7. Syntax highlighting for code blocks
8. Disqus Commenting
9. Social Profiles

### Navigating Posts

In the Ghost App, posts are displayed in a fullscreen slider when the page loads.

Try swiping left / right, pressing left / right on the keyboard, or using the left / right arrows to navigate between posts.

Swiping down, pressing the down key, or clicking the down arrow will take you to the full post.

## iOS / Mobile fallback, SEO Friendly pages

An alternate, static set of pages are generated for the index and for each post to facilitate mobile and iOS viewing. This also acts as a set of SEO friendly pages which can be crawled by google & other web robots.

This will appear automatically & doesn't require any additional setup.

## Installation

Unzip this theme to **./ghost/content/themes/** & select it from the **General Settings** page.

While you're there, set **Posts per page** to **1000**.

Your **Blog Title** is what will appear as your site logo in the upper-left hand corner of the app.

You can upload a default **Blog Cover**, which will be displayed for any post without a cover defined.

The information in your  **User Settings** will be displayed at the bottom of each post (except for the cover).

You will also need to edit the line of your **./ghost/config.js** file which contains your blog URL. (See Ghost documentation)

## Writing a Post

All current Ghost features are supported, along with a few additions.

Posts are written using markdown. (See Ghost documentation)

### Cover Image

You can set an optional cover image by including the following snippet at the bottom of your page:

    cover: http://url-to-your-image.jpg

Ensuring that you replace **http:url-to-your-image.jpg** with the URL to the image you wish to use.

### Categories & Subcategories

You can optionally place your blog posts inside categories and subcategories by including the following snippet at the bottom of your page:

    category: Blogging
    subcategory: Ghost

Ensuring that you replace **Blogging** and **Ghost** with your respective category and subcategory. These are case sensitive, and will be used
to automatically generate a dropdown menu for your blog, which will display links to only posts in specific subcategories.

### Subtitle

A subtitle is an optional secondary title for your blog post, displayed below the headline title.

You can optionally add a subtitle to your posts by including the following snippet at the bottom of your page:

    subtitle: This is my blog subtitle

Ensuring that you replace **This is my blog subtitle** with your desired post subtitle.

## Enabling Disqus Comments

To enable comments on your blog, sign up for an account at **disqus.com**. You will be given a **Disqus Shortname** for your blog.

Enter this shortname inside your **Blog Description** on the **General Settings** page. Make sure it is on a line all by itself, preceeded by **shortname:**

For example, my shortname is kidgodzilla, so my blog description looks like this:

    Just a blogging platform.
    shortname: kidgodzilla

## Enabling social media links

You can enable any number of social media links to be displayed below each post by including the following snippet in your **Author Bio**:

    Thanks for reading this post! Follow our blog for instant updates.
    facebook: abc
    twitter: @abc
    gplus: +abc
    pinterest: abc
    github: abc

Ensuring that you replace the username above with your account usernames. If you do not wish to display a social media link for a
particular service, ensure you do not include the line for that service. Links will appear automatically at the bottom of each post.


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
