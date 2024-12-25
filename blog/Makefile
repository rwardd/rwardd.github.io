all: writings blog.html

SOURCES=first_entry/first.md
OBJS=$(SOURCES:.md=.html)

writings: $(OBJS)

clean:
	rm -rf $(OBJS) blog.html

%.html: %.md blog_template.html
	pandoc --toc -s --css ../../reset.css --css ../../index.css -i $< -o $@ --template=blog_template.html

blog.html: blog_index.md blog_template.html
	pandoc --toc -s --css ../reset.css --css ../index.css -i $< -o $@ --template=blog_template.html

.PHONY: all clean
